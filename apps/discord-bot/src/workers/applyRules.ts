import { OAuth2Guild } from 'discord.js';
import { getDocs, query, where } from 'firebase/firestore';
import { defaultProvider, number, stark } from 'starknet';
import { useAppContext } from '..';

export async function applyRules() {
  const guilds = await useAppContext().discordClient.guilds.fetch();
  for (const [id, guild] of guilds) {
    await applyRulesForGuild(guild);
  }
}

export async function applyRulesForGuild(g: OAuth2Guild) {
  const guild = await g.fetch();
  console.log('Apply rules for guild:', guild.name);

  const { rulesOfGuild } = useAppContext().firebase;
  const rulesSnapshot = await getDocs(rulesOfGuild(guild.id));
  const rules = rulesSnapshot.docs.map((doc) => doc.data());

  const guildMembers = await guild.members.fetch();
  for (const [id, member] of guildMembers) {
    try {
      const accountAddress = await getAccountAddress(id);
      if (!accountAddress) {
        continue;
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
        console.log(balance);
        if (
          (balance < rule.minBalance || balance > rule.maxBalance) &&
          member.roles.cache.has(rule.roleId)
        ) {
          console.log(
            'Remove  role:',
            member.roles.cache.get(rule.roleId).name
          );
          await member.roles.remove(rule.roleId);
        } else if (
          balance >= rule.minBalance &&
          balance <= rule.maxBalance &&
          !member.roles.cache.has(rule.roleId)
        ) {
          console.log('Add role:', rule.roleId);
          const theRole = guild.roles.cache.get(rule.roleId);
          if (theRole.position >= guild.me.roles.highest.position) {
            console.log("I can't give that role !");
            console.log("Role position : ", theRole.position);
            console.log("My highest role : ", guild.me.roles.highest.position);
          } else {
            await member.roles.add(rule.roleId);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

async function getAccountAddress(
  discordMemberId: string
): Promise<string | null> {
  const starknetIdsColRef = useAppContext().firebase.starknetIds;
  const q = query(
    starknetIdsColRef,
    where('discordMemberId', '==', discordMemberId)
  );
  const starknetIdsSnapshot = await getDocs(q);
  if (starknetIdsSnapshot.docs.length == 0) {
    return null;
  }
  return starknetIdsSnapshot.docs[0].data().accountAddress;
}
