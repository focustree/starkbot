import { GuildMember, OAuth2Guild } from 'discord.js';
import { useAppContext } from '..';
import { logger } from '../../../configuration/logger';
import { printError, getCPDB, setCPDB } from './tools';
import * as async from 'async';
import axios from 'axios';

async function applyRule(member) {
  return (await axios({
    method: 'post',
    url: 'https://applyRule/',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      member
    }),
  }));
}

export async function applyRules() {
  const guilds = await useAppContext().discordClient.guilds.fetch();

  await async.each(
    guilds.map((item) => item),
    applyRulesForGuild,
    (err) => printError(err)
  );
  // V 1.0
  //await Promise.all(promiseList.map((arg) => applyRulesForGuild(arg)));
}

async function applyRulesForGuild(g: OAuth2Guild) {
  const guild = await g.fetch();
  /*setCPDB(`${guild.name}`, false);*/
  logger.info(`Apply rules for guild: ${guild.name}`);

  const guildMembers = await guild.members.fetch();

  await async.each(
    guildMembers.map((item) => item),
    applyRuleIf,
    (err) => printError(err)
  );
}

async function applyRuleIf(member: GuildMember) {
  /*if (getCPDB(`${member.guild.name}`)) {
    setCPDB(`${member.guild.name}`, false);
    return;
  }*/
  await applyRule(member);
}
