import {
  BaseCommandInteraction,
  ChatInputApplicationCommandData,
  Client,
  Intents,
} from 'discord.js';
import { Config } from '../config';
import { AddRule } from './commands/addRule';
import { Hello } from './commands/hello';
import { onInteractionCreate } from './events/interactionCreate';
import { onReady } from './events/ready';

export const commands = [Hello, AddRule];

export async function initDiscordClient(config: Config) {
  const client = new Client({
    intents: [Intents.FLAGS.GUILD_MEMBERS],
  });

  onReady(client);
  onInteractionCreate(client);

  await client.login(config.discordToken);
  await client.application.commands.set(commands);

  return client;
}

export interface Command extends ChatInputApplicationCommandData {
  run: (client: Client, interaction: BaseCommandInteraction) => Promise<void>;
}
