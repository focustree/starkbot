import { Client } from 'discord.js';
import { alwaysTrue, sleep } from './utils';

export const fetchDiscordMembers = async (client: Client) => {
  while (alwaysTrue) {
    console.log('Fetching discord members');
    const guilds = await client.guilds.fetch();
    console.log(guilds);
    await sleep(5);
  }
};
