import { OAuth2Guild } from 'discord.js';
import { useAppContext } from '..';
import { logger } from '../../../configuration/logger';
import { printError } from './tools';
import { putItem } from '../../../models/dynamoQueries';
import * as async from 'async';
import axios from 'axios';

async function fetchMember(member) {
  return (await axios({
    method: 'post',
    url: 'https://fetchMember/',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      member
    }),
  }));
}

export async function fetchDiscordMembers() {
  const guilds = await useAppContext().discordClient.guilds.fetch();

  await async.each(
    guilds.map((item) => item),
    fetchDiscordMembersForGuild,
    (err) => printError(err)
  );
  // V 1.0
  // await Promise.all(promiseList.map((arg) => fetchDiscordMembersForGuild(arg)));
}

async function fetchDiscordMembersForGuild(g: OAuth2Guild) {
  const guild = await g.fetch();
  logger.info('carrying of guild ' + guild.name);
  const responseGuild = await putItem('guild', {
    'guild-id': guild.id,
    Name: guild.name,
    Roles: [],
    Members: [],
    Rules: [],
  });
  if (responseGuild.response) {
    // DEBUG
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
