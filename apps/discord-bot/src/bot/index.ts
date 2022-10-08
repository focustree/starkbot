const { Client, GatewayIntentBits } = require('discord.js');

import { Config } from '../config';
import { commandList } from './commands/commandList';
import { onInteractionCreate } from './events/interactionCreate';
import { onReady } from './events/ready';


export async function initDiscordClient(config: Config) {
  const client = new Client({
    intents: [GatewayIntentBits.GuildMembers],
  });

  onReady(client);
  onInteractionCreate(client);
  await client.login(config.discordToken);
  await client.application.commands.set(commandList);

  return client;
}

