import { Client } from 'discord.js';
import { config, safePrintConfig } from '../../configuration/config';
import { initDiscordClient } from './bot/init';
import { doLoopOnWorkers } from './workers/workerManager';

export interface AppContext {
  discordClient: Client;
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
  _appContext = { discordClient };

  await doLoopOnWorkers();
};

runApp();
