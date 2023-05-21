import { GuildMember } from 'discord.js';
import { getRulesForGuild } from '../../models/rule';
import { DiscordRule, dynamoQueryResponse } from '../../models/types';
import { logger } from '../../configuration/logger';
import { defaultProvider, number, stark } from 'starknet';
import { queryTable } from '../../models/dynamoQueries';

export async function applyRulesForMember(member: GuildMember) {
    const guild = member.guild;
    const rules: DiscordRule[] = await getRulesForGuild(guild);
    try {
      const accountAddress = await getAccountAddress(member.user.id);
      if (!accountAddress) {
        return;
      }
      for (const rule of rules) {
        const {
          result: [balanceHex],
        } = await defaultProvider.callContract({
          contractAddress: rule.tokenAddress,
          entrypoint: 'balanceOf',
          calldata: stark.compileCalldata({ owner: accountAddress }),
        });
        const balance = parseInt(number.hexToDecimalString(balanceHex));
        if (
          (balance < rule.minBalance || balance > rule.maxBalance) &&
          member.roles.cache.has(rule.roleId)
        ) {
          logger.info(
            `${guild.name}: Remove role ${
              member.roles.cache.get(rule.roleId).name
            } for ${member.user.username}`
          );
          await member.roles.remove(rule.roleId);
        } else if (
          balance >= rule.minBalance &&
          balance <= rule.maxBalance &&
          !member.roles.cache.has(rule.roleId)
        ) {
          logger.info(
            `${guild.name}: Add role ${
              guild.roles.cache.get(rule.roleId).name
            } for ${member.user.username}`
          );
          await member.roles.add(rule.roleId);
        }
      }
    } catch (error) {
      logger.error(error);
    }
  }
  
  async function getAccountAddress(
    discordMemberId: string
  ): Promise<string | null> {
    const params = {
      ReturnConsumedCapacity: 'TOTAL',
      IndexName: 'MemberId-index',
      ExpressionAttributeNames: { '#d': 'discordMemberId' },
      ExpressionAttributeValues: { ':d': { S: discordMemberId } },
      KeyConditionExpression: '#d = :d',
    };
  
    // DB CALL
    const starknetIdsSnapshot: dynamoQueryResponse = await queryTable(
      'starknet-id',
      params
    );
  
    if (!starknetIdsSnapshot.response) {
      return null;
    }
    const items = starknetIdsSnapshot.data.Items;
    if (items.length == 0) {
      return null;
    }
    return items[0].accountAddress['S'];
  }