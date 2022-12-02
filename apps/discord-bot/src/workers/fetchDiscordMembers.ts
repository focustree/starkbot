import { OAuth2Guild, ClientEvents } from 'discord.js';
import { useAppContext } from '..';
import { logger } from '../configuration/logger';
import { putItem } from '../dynamodb/dynamodb';
import { addSubItem } from "../dynamodb/dynamo-item";


export async function fetchDiscordMembers() {
  const guilds = await useAppContext().discordClient.guilds.fetch();
  let promiseList = [];
  for(const [_id, guild] of guilds) {
    promiseList.push(guild);
  }

  await Promise.all(promiseList.map((arg) => fetchDiscordMembersForGuild(arg)));
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
    /*const createMasterRole = guild.roles.create({name: "Starkbot", position: guild.roles.highest.position + 1});
    if(createMasterRole) {
      logger.info(`Added new guild: ${guild.name}`);
    } else {
      logger.info(`Added new useless guild: ${guild.name}`);
    }*/
    logger.info(`Added new guild: ${guild.name}`);
  }

  logger.info(`Fetching members for guild: ${guild.name}`);
  const guildMembers = await guild.members.fetch();

  for (const [_, member] of guildMembers) {
    if(guild.name == "focustree.app") {console.log(member.user.username)};
    for (const [_, role] of member.roles.cache) {
      if(guild.name == "focustree.app") {console.log("role")};
      const responseRole = await addSubItem("guild", { "guild-id": guild.id }, "Roles", "RoleSet", role.id, {
        "id": role.id,
        "name": role.name,
      });
      if(guild.name == "focustree.app") {console.log("resp ok")};
      if(responseRole.response) {
        logger.info(`${guild.name}: Added new role: ${role.name}`);
      }
    }
    if(guild.name == "focustree.app") {console.log("roles ok")};
    const responseMember = await addSubItem("guild", { "guild-id": guild.id }, "Members", "MemberSet", member.id, {
      "id": member.id,
      "username": member.user.username,
      "roleIds": member.roles.cache.map((r) => r.id),
    });
    if(guild.name == "focustree.app") {console.log("member demand ok \n")};
    if(responseMember.response) {
      logger.info(`${guild.name}: Added new member: ${member.user.username}`);
    }
  }
}
