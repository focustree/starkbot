import { GuildMember, OAuth2Guild, Guild } from 'discord.js';
import { defaultProvider, number, stark } from 'starknet';
import { useAppContext } from '..';
import { logger } from '../configuration/logger';
import { queryTable } from '../dynamodb/dynamodb';
import { getRulesForGuild } from '../models/rule';
import { DiscordRule } from '../dynamodb/db-types';

// mutex to lock db access when it is modified
export let compromisedDB = [];

export async function applyRules() {
  const guilds = await useAppContext().discordClient.guilds.fetch();
  let promiseList = [];
  for (const [_id, guild] of guilds) {
    await promiseList.push(guild);
  }

  await Promise.all(promiseList.map((arg) => applyRulesForGuild(arg)));
}

async function applyRulesForGuild(g: OAuth2Guild) {
  const guild = await g.fetch();
  setCPDB(`${guild.name}`, false);
  logger.info(`Apply rules for guild: ${guild.name}`);
  const rules = await getRulesForGuild(g);

  const guildMembers = await guild.members.fetch();

  for (const [_id, member] of guildMembers) {
    if(getCPDB(`${guild.name}`)) {
      setCPDB(`${guild.name}`, false);
      return;
    }
    await applyRulesForMember(guild, member, rules)
  }
}

async function applyRulesForMember(guild: Guild, member: GuildMember, rules: DiscordRule[]) {
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

export function setCPDB(guild: string, value: boolean) {
  compromisedDB[guild] = value;
}

export function getCPDB(guild: string) {
  return compromisedDB[guild];
}