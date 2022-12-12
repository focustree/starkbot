import { GuildMember, OAuth2Guild, Guild } from 'discord.js';
import { defaultProvider, number, stark } from 'starknet';
import { useAppContext } from '..';
import { logger } from '../configuration/logger';
import { queryTable } from '../dynamodb/dynamodb';
import { getRulesForGuild } from '../models/rule';
import { DiscordRule } from '../dynamodb/db-types';
import { printError, getCPDB, setCPDB } from './tools';
import * as async from "async";


export async function applyRules() {
  const guilds = await useAppContext().discordClient.guilds.fetch();

  await async.each(guilds.map(item => item), applyRulesForGuild, (err) => printError(err))
  //await Promise.all(promiseList.map((arg) => applyRulesForGuild(arg)));
}

async function applyRulesForGuild(g: OAuth2Guild) {
  const guild = await g.fetch();
  setCPDB(`${guild.name}`, false);
  logger.info(`Apply rules for guild: ${guild.name}`);

  const guildMembers = await guild.members.fetch();

  await async.each(guildMembers.map(item => item), applyRuleIf, (err) => printError(err));
}

async function applyRuleIf(member: GuildMember) {
  if(getCPDB(`${member.guild.name}`)) {
    setCPDB(`${member.guild.name}`, false);
    return;
  }
  await applyRulesForMember(member);
}

async function applyRulesForMember(member: GuildMember) {
  const guild = member.guild;
  const rules: DiscordRule[] = await getRulesForGuild(guild);
  try {
    const accountAddress = await getAccountAddress(member.user.id);
    if (!accountAddress) {
      return;
    }
    for (const rule of rules) {
      const { result: [balanceHex] } = await defaultProvider.callContract({
        contractAddress: rule.tokenAddress,
        entrypoint: 'balanceOf',
        calldata: stark.compileCalldata({ owner: accountAddress }),
      });
      const balance = parseInt(number.hexToDecimalString(balanceHex));
      if (
        (balance < rule.minBalance || balance > rule.maxBalance) &&
        member.roles.cache.has(rule.roleId)
      ) {
        logger.info(`${guild.name}: Remove role ${member.roles.cache.get(rule.roleId).name} for ${member.user.username}`);
        await member.roles.remove(rule.roleId);
      } else if (
        balance >= rule.minBalance &&
        balance <= rule.maxBalance &&
        !member.roles.cache.has(rule.roleId)
      ) {
        logger.info(`${guild.name}: Add role ${guild.roles.cache.get(rule.roleId).name} for ${member.user.username}`);
        await member.roles.add(rule.roleId);

      }
    }
  } catch (error) {
    logger.error(error);
  }
}


async function getAccountAddress(discordMemberId: string): Promise<string | null> {

  const params = {
    ReturnConsumedCapacity: "TOTAL",
    IndexName: "MemberId-index",
    ExpressionAttributeNames: { "#d": "discordMemberId" },
    ExpressionAttributeValues: { ":d": { "S": discordMemberId } },
    KeyConditionExpression: "#d = :d",
  };

  const starknetIdsSnapshot = await queryTable("starknet-id", params);

  if (!starknetIdsSnapshot.response) {
    return null;
  }
  const items = starknetIdsSnapshot.data.Items;
  if(items.length == 0) {
    return null;
  }
  return items[0].accountAddress['S'];
}
