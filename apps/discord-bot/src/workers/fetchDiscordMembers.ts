import { OAuth2Guild } from 'discord.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
    await setDoc(doc(ctx.firebase.guilds, guild.id), {
      id: guild.id,
      name: guild.name,
    });
    console.log('Fetching members for guild:', guild.name);
    const guildMembers = await guild.members.fetch();
    for (const [_, member] of guildMembers) {
      for (const [_, role] of member.roles.cache) {
        await setDoc(doc(ctx.firebase.rolesOfGuild(guild.id), role.id), {
          id: role.id,
          name: role.name,
        });
      }
      await setDoc(doc(ctx.firebase.membersOfGuild(guild.id), member.id), {
        id: member.id,
        username: member.user.username,
        roleIds: member.roles.cache.map((r) => r.id),
      });
    }
  };
