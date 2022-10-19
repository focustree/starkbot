import { OAuth2Guild } from 'discord.js';
import { doc, setDoc } from 'firebase/firestore';
import { useAppContext } from '..';
import { logger } from '../configuration/logger';

export async function fetchDiscordMembers() {
  const guilds = await useAppContext().discordClient.guilds.fetch();
  for (const [id, guild] of guilds) {
    await fetchDiscordMembersForGuild(guild);
  }
}

async function fetchDiscordMembersForGuild(g: OAuth2Guild) {
  const appContext = useAppContext();
  const guild = await g.fetch();
  await setDoc(doc(appContext.firebase.guilds, guild.id), {
    id: guild.id,
    name: guild.name,
  });
  logger.info(`Fetching members for guild: ${guild.name}`);
  const guildMembers = await guild.members.fetch();
  for (const [_, member] of guildMembers) {
    for (const [_, role] of member.roles.cache) {
      await setDoc(doc(appContext.firebase.rolesOfGuild(guild.id), role.id), {
        id: role.id,
        name: role.name,
      });
    }
    await setDoc(doc(appContext.firebase.membersOfGuild(guild.id), member.id), {
      id: member.id,
      username: member.user.username,
      roleIds: member.roles.cache.map((r) => r.id),
    });
  }
}
