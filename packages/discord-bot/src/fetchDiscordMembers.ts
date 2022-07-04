import { Client, OAuth2Guild } from 'discord.js';
import { alwaysTrue, sleep } from './utils';

export const fetchDiscordMembers = async (client: Client) => {
  while (alwaysTrue) {
    console.log('Fetching discord members');
    const guilds = await client.guilds.fetch();
    await Promise.all(guilds.map(fetchDiscordMembersForGuild));
    await sleep(5);
  }
};

const fetchDiscordMembersForGuild = async (g: OAuth2Guild) => {
  console.log('Waiting for guild:', g.name);
  const guild = await g.fetch();
  console.log('Waiting for members:');
  const guildMembers = await guild.members.fetch();
  console.log(guildMembers.map((m) => m.user.username));
  return;
};
