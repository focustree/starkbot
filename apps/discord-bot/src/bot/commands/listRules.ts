import { useAppContext } from '@starkbot/discord-bot';
import { CommandInteraction, Client } from 'discord.js';
import { getDocs } from 'firebase/firestore';
import { formatRule } from '../../utils';

export async function listRulesCommand(client: Client, interaction: CommandInteraction) {
  await interaction.deferReply();

  const { rulesOfGuild } = useAppContext().firebase;
  const rulesSnapshot = await getDocs(rulesOfGuild(interaction.guild.id));
  const rules = rulesSnapshot.docs.map((doc) => {
    const { roleId, tokenAddress, minBalance, maxBalance } = doc.data();
    const role = interaction.guild.roles.cache.get(roleId);
    return { role: role.name, tokenAddress, minBalance, maxBalance };
  });

  if (rules.length == 0) {
    await interaction.followUp({
      content: `You have no active rules`
    });
    return;
  }
  await interaction.followUp({
    content: `You have ${rules.length} active rules: \n${rules
      .map((rule) => formatRule(rule))
      .join('\n')}`,
  });
  return;
}

