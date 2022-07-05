import { OAuth2Guild } from 'discord.js';
import { doc, setDoc } from 'firebase/firestore';
import { AppContext } from '..';
import { GuildDoc } from '../firebase';

export const fetchDiscordMembers = (ctx: AppContext) => async () => {
  const guilds = await ctx.discordClient.guilds.fetch();
  for (const [id, guild] of guilds) {
    await fetchDiscordMembersForGuild(ctx)(guild);
  }
};

const fetchDiscordMembersForGuild =
  (ctx: AppContext) => async (g: OAuth2Guild) => {
    const guild = await g.fetch();
    console.log('Fetching members for guild:', guild.name);
    const guildMembers = await guild.members.fetch();
    await setDoc(doc(ctx.firebase.guilds, guild.id), {
      id: guild.id,
      name: guild.name,
      members: guildMembers.map((m) => ({
        id: m.id,
        username: m.user.username,
      })),
    });
  };
