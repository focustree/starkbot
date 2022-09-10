import { Client } from 'discord.js';

import { fetchDiscordMembers } from './workers/fetchDiscordMembers';
import { schedule } from './utils';
import { config, safePrintConfig } from './config';
import { initDiscordClient } from './bot';
import { fetchStarknetIds } from './workers/fetchStartknetIds';
import { applyRules } from './workers/applyRules';
import { Firebase, initFirebase } from './firebase';

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
  safePrintConfig();

  const discordClient = await initDiscordClient(config);
  console.log('Discord client initialized');

  const firebase = initFirebase(config);
  console.log('Firebase client initialized');

  _appContext = { discordClient, firebase };

  await Promise.all([
    schedule(fetchDiscordMembers, 10),
    schedule(fetchStarknetIds, 10),
    schedule(applyRules, 10),
  ]);
};

runApp();
