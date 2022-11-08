import { OAuth2Guild } from 'discord.js';
import { useAppContext } from '..';
import { logger } from '../configuration/logger';
import { addSubItem, putItem } from '../dynamodb';


export async function fetchDiscordMembers() {
  const guilds = await useAppContext().discordClient.guilds.fetch();
  for (const [_id, guild] of guilds) {
    await fetchDiscordMembersForGuild(guild);
  }
}

async function fetchDiscordMembersForGuild(g: OAuth2Guild) {
  const guild = await g.fetch();
  const responseGuild = await putItem("guild", {
    "guild-id": guild.id,
    "Name": guild.name,
    "Roles": [],
    "Members": [],
    "Rules": [],
  });
  if(responseGuild.response) {
    logger.info(`Added new guild: ${guild.name}`);
  }

  logger.info(`Fetching members for guild: ${guild.name}`);
  const guildMembers = await guild.members.fetch();

  for (const [_, member] of guildMembers) {
    for (const [_, role] of member.roles.cache) {
      const responseRole = await addSubItem("guild", { "guild-id": guild.id }, "Roles", "RoleSet", role.id, {
        "id": role.id,
        "name": role.name,
      });
      if(responseRole.response) {
        logger.info(`Added new role: ${role.name}`);
      }
    }
    const responseMember = await addSubItem("guild", { "guild-id": guild.id }, "Members", "MemberSet", member.id, {
      "id": member.id,
      "username": member.user.username,
      "roleIds": member.roles.cache.map((r) => r.id),
    });
    if(responseMember.response) {
      logger.info(`Added new member: ${member.user.username}`);
    }
  }
}
