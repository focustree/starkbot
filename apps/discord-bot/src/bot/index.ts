import { Client, Intents } from 'discord.js';
import { Config } from '../config';
import { onInteractionCreate } from './listeners/onInteractionCreate';
import { onReady } from './listeners/onReady';

export async function initDiscordClient(config: Config) {
  const client = new Client({
    intents: [Intents.FLAGS.GUILD_MEMBERS],
  });

  onReady(client);
  onInteractionCreate(client);

  await client.login(config.discordToken);

  return client;
}
