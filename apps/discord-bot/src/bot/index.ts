import { Config } from '../config';
import { commandList } from './commands/commandList';
import { onInteractionCreate } from './events/interactionCreate';
import { onReady } from './events/ready';

const { Client, GatewayIntentBits } = require('discord.js');


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

  return client;
}

