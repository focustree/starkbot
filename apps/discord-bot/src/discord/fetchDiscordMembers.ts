import { Client, OAuth2Guild } from 'discord.js';
import { DiscordState } from './discordState';

interface DiscordContext {
  client: Client;
  discordState: DiscordState;
}

export const fetchDiscordMembers = async (ctx: DiscordContext) => {
  console.log('Fetching discord members');
  const guilds = await ctx.client.guilds.fetch();
  for (const [id, guild] of guilds) {
    await fetchDiscordMembersForGuild(ctx, guild);
  }
};

const fetchDiscordMembersForGuild = async (
  ctx: DiscordContext,
  g: OAuth2Guild
) => {
  console.log('Waiting for guild:', g.name);
  const guild = await g.fetch();
  const guildMembers = await guild.members.fetch();
  console.log(guildMembers.map((m) => m.user.id));
  return;
};
