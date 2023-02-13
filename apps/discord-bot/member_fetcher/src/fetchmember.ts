import { GuildMember } from 'discord.js';
import { logger } from './configuration/logger';
import { addSubItem } from '../../dynamoQueries';

export async function fetchMember(member: GuildMember) {
  //logger.info("carrying of user " + member.user.username);
  for (const [_, role] of member.roles.cache) {
    const responseRole = await addSubItem(
      'guild',
      { 'guild-id': member.guild.id },
      'Roles',
      'RoleSet',
      role.id,
      {
        id: role.id,
        name: role.name,
      }
    );
    if (responseRole.response) {
      logger.info(`${member.guild.name}: Added new role: ${role.name}`);
    }
  }
  const responseMember = await addSubItem(
    'guild',
    { 'guild-id': member.guild.id },
    'Members',
    'MemberSet',
    member.id,
    {
      id: member.id,
      username: member.user.username,
      roleIds: member.roles.cache.map((r) => r.id),
    }
  );
  if (responseMember.response) {
    logger.info(
      `${member.guild.name}: Added new member: ${member.user.username}`
    );
  }
}
