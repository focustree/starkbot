import { useAppContext } from '@starkbot/discord-bot';
import { BaseCommandInteraction, Client } from 'discord.js';
import { doc, getDoc, getDocs, query } from 'firebase/firestore';
import { Command } from '..';
import { formatRule } from '../../utils';

const listRulesCommandName = 'starkbot-list-rules';

export const ListRules: Command = {
  name: listRulesCommandName,
  description: 'List all starkbot rules',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.deferReply();

    const { rulesOfGuild } = useAppContext().firebase;
    const rulesSnapshot = await getDocs(rulesOfGuild(interaction.guild.id));
    const rules = rulesSnapshot.docs.map((doc) => {
      const { roleId, tokenAddress, minBalance, maxBalance } = doc.data();
      const role = interaction.guild.roles.cache.get(roleId);
      return { role: role.name, tokenAddress, minBalance, maxBalance };
    });

    await interaction.followUp({
      content: `You have ${rules.length} active rules: \n${rules
        .map((rule) => formatRule(rule))
        .join('\n')}`,
    });
    return;
  },
};
