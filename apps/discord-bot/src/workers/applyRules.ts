import { GuildMember, OAuth2Guild } from 'discord.js';
import { defaultProvider, number, stark } from 'starknet';
import { useAppContext } from '..';
import { logger } from '../configuration/logger';
import { queryTable } from '../dynamodb-libs/dynamodb';
import { getRulesForGuild } from '../models/rule';
import { DiscordRule } from '../dynamodb-libs/db-types';

export async function applyRules() {
  const guilds = await useAppContext().discordClient.guilds.fetch();
  for (const [_id, guild] of guilds) {
    await applyRulesForGuild(guild);
  }
}

async function applyRulesForGuild(g: OAuth2Guild) {
  const guild = await g.fetch();
  logger.info(`Apply rules for guild: ${guild.name}`);
  const rules = await getRulesForGuild(g);

  const guildMembers = await guild.members.fetch();

  for (const [_id, member] of guildMembers) {
    await applyRulesForMember(member, rules)
  }
}

async function applyRulesForMember(member: GuildMember, rules: DiscordRule[]) {
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
        logger.info(`Remove  role: ${member.roles.cache.get(rule.roleId).name}`);
        await member.roles.remove(rule.roleId);
      } else if (
        balance >= rule.minBalance &&
        balance <= rule.maxBalance &&
        !member.roles.cache.has(rule.roleId)
      ) {
        logger.info(`Add role: ${rule.roleId}`);
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

