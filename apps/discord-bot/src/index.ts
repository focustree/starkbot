import { Client } from 'discord.js';

import { fetchDiscordMembers } from './workers/fetchDiscordMembers';
import { schedule } from './utils';
import { config } from './config';
import { initDiscordClient } from './bot';
import { Firebase, initFirebase } from './firebase';
import { fetchStarknetIds } from './workers/fetchStartknetIds';
import { applyRules } from './workers/applyRules';

export interface AppContext {
  discordClient: Client;
  firebase: Firebase;
}

var _appContext: AppContext;
export function useAppContext() {
  if (!_appContext) {
    throw new Error('App context not initialized');
  }
  return _appContext;
}

const runApp = async () => {
  console.log('Config:', {
    env: config.env,
    projectId: config.firebaseConfig.projectId,
    discordInviteLink: config.discordInviteLink,
  });

  const discordClient = await initDiscordClient(config);
  console.log('Discord client initialized');

  const firebase = initFirebase(config);
  console.log('Firebase client initialized');

  _appContext = { discordClient, firebase };

  await Promise.all([
    schedule(fetchDiscordMembers, 5),
    schedule(fetchStarknetIds, 5),
    schedule(applyRules, 1),
  ]);
};

runApp();
