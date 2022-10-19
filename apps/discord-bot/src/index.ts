import { Client } from 'discord.js';
import { config, safePrintConfig } from './configuration/config';
import { initDiscordClient } from './bot';
import { Firebase, initFirebase } from './models/firebase';
import { doLoopOnWorkers } from './workers/workerManager';

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
  const firebase = initFirebase(config);
  _appContext = { discordClient, firebase };

  await doLoopOnWorkers();
};


runApp();

