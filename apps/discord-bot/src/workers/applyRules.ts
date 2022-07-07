import { OAuth2Guild } from 'discord.js';
import { getDocs } from 'firebase/firestore';
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
      for (const rule of rules) {
        const {
          result: [balanceHex],
        } = await defaultProvider.callContract({
          contractAddress: rule.tokenAddress,
          entrypoint: 'balanceOf',
          calldata: stark.compileCalldata({ owner: accountAddress }),
        });
        const balance = parseInt(number.hexToDecimalString(balanceHex));
        if (balance == 0 && member.roles.cache.has(rule.roleId)) {
          console.log('Remove  role:', member.roles.cache.get(rule.roleId));
          await member.roles.remove(rule.roleId);
        } else if (balance > 0 && !member.roles.cache.has(rule.roleId)) {
          console.log('Add role:', member.roles.cache.get(rule.roleId));
          await member.roles.add(rule.roleId);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

async function getAccountAddress(discordMemberId: string) {
  // Gabin
  if (discordMemberId === '244940825572802560') {
    return '0x0367c0c4603a29Bc5aCA8E07C6A2776D7C0d325945aBB4f772f448b345Ca4Cf7';
  }
  return `0x${discordMemberId}`;
}
