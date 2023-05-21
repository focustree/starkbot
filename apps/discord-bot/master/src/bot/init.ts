const { Client, GatewayIntentBits } = require('discord.js');

import { Config } from '../../../configuration/config';
import { logger } from '../../../configuration/logger';

import { commandList } from './commands/commandList';
import { onInteractionCreate } from './events/interactionCreateHandler';
import { onReady } from './events/ready';


export async function initDiscordClient(config: Config) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
    ],
  });

  onReady(client);
  onInteractionCreate(client);
  await client.login(config.discordToken);
  await client.application.commands.set(commandList);

  logger.info('Discord client initialized');
  return client;
}