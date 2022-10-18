
import { GuildMember, OAuth2Guild } from 'discord.js';

import { getDocs, query, where } from 'firebase/firestore';
import { defaultProvider, number, stark } from 'starknet';
import { useAppContext } from '..';
import { logger } from '../configuration/logger';
import { getRulesForGuild, RuleDoc } from '../models/rule';

export async function applyRules() {
  const guilds = await useAppContext().discordClient.guilds.fetch();
  for (const [id, guild] of guilds) {
    await applyRulesForGuild(guild);
  }
}

async function applyRulesForGuild(g: OAuth2Guild) {
  const guild = await g.fetch();
  logger.info(`Apply rules for guild: ${guild.name}`);
  const rules = (await getRulesForGuild(g)).map((doc) => doc.data());

  const guildMembers = await guild.members.fetch();
  for (const [id, member] of guildMembers) {

    await applyRulesForMember(id, member, rules)
  }
}

async function applyRulesForMember(id: string, member: GuildMember, rules: RuleDoc[]) {
  try {
    const accountAddress = await getAccountAddress(id);
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
  const starknetIdsColRef = useAppContext().firebase.starknetIds;
  const q = query(starknetIdsColRef,
    where('discordMemberId', '==', discordMemberId)
  );
  const starknetIdsSnapshot = await getDocs(q);
  if (starknetIdsSnapshot.docs.length == 0) {
    return null;
  }
  return starknetIdsSnapshot.docs[0].data().accountAddress;
}
