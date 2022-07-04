export * from './lib/discord-bot';

import { Client } from 'discord.js';

console.log('Bot is starting...');

const client = new Client({
  intents: [],
});

console.log(client);
