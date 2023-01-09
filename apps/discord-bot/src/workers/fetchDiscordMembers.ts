import { OAuth2Guild, ClientEvents, GuildMember, Guild } from 'discord.js';
import { useAppContext } from '..';
import { logger } from '../configuration/logger';
import { putItem } from '../dynamodb/dynamodb';
import { addSubItem } from "../dynamodb/dynamo-item";
import { printError } from "./tools";
import * as async from "async";


export async function fetchDiscordMembers() {
  const guilds = await useAppContext().discordClient.guilds.fetch();

  await async.each(guilds.map(item => item), fetchDiscordMembersForGuild, (err) => printError(err));
  // await Promise.all(promiseList.map((arg) => fetchDiscordMembersForGuild(arg)));
}

async function fetchDiscordMembersForGuild(g: OAuth2Guild) {
  const guild = await g.fetch();
  logger.info("carrying of guild " + guild.name);
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

  await async.each(guildMembers.map((item) => item), fetchMember, (err) => printError(err));

}

async function fetchMember(member: GuildMember) {
  //logger.info("carrying of user " + member.user.username);
  for (const [_, role] of member.roles.cache) {
    //if(member.guild.name == "focustree.app") {console.log("role")};
    const responseRole = await addSubItem("guild", { "guild-id": member.guild.id }, "Roles", "RoleSet", role.id, {
      "id": role.id,
      "name": role.name,
    });
    //if(member.guild.name == "focustree.app") {console.log("resp ok")};
    if(responseRole.response) {
      logger.info(`${member.guild.name}: Added new role: ${role.name}`);
    }
  }
  //if(member.guild.name == "focustree.app") {console.log("roles ok")};
  const responseMember = await addSubItem("guild", { "guild-id": member.guild.id }, "Members", "MemberSet", member.id, {
    "id": member.id,
    "username": member.user.username,
    "roleIds": member.roles.cache.map((r) => r.id),
  });
  //if(member.guild.name == "focustree.app") {console.log("member demand ok \n")};
  if(responseMember.response) {
    logger.info(`${member.guild.name}: Added new member: ${member.user.username}`);
  }
}
