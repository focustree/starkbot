import { Client } from 'discord.js';

import { fetchDiscordMembers } from './workers/fetchDiscordMembers';
import { schedule } from './utils';
import { config } from './config';
import { initDiscordClient } from './bot';
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
  console.log('Running in env:', config.env);

  const discordClient = await initDiscordClient(config);
  console.log('Discord client initialized');

  const firebase = await initFirebase(config);
  console.log('Firebase client initialized');

  const ctx = { discordClient, firebase };
  _appContext = ctx;

  await Promise.all([schedule(fetchDiscordMembers(ctx), 5)]);
};

runApp();
