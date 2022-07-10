import { useAppContext } from '@starkbot/discord-bot';
import {
  BaseCommandInteraction,
  Client,
  MessageActionRow,
  MessageSelectMenu,
  SelectMenuInteraction,
} from 'discord.js';
import { deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { Command } from '..';
import { formatRule, formatShortTokenAddress } from '../../utils';

export const deleteRuleCommandName = 'starkbot-delete-rule';
export const deleteRuleId = `${deleteRuleCommandName}-role`;

export const DeleteRule: Command = {
  name: deleteRuleCommandName,
  description: 'Delete a starkbot rule',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.deferReply();

    const { rulesOfGuild } = useAppContext().firebase;
    const rulesSnapshot = await getDocs(rulesOfGuild(interaction.guild.id));
    const ruleOptions = rulesSnapshot.docs.map((doc) => {
      const { roleId, tokenAddress, minBalance, maxBalance } = doc.data();
      const role = interaction.guild.roles.cache.get(roleId);
      return {
        label: role.name,
        value: doc.id,
        description: `Token Address: ${formatShortTokenAddress(
          tokenAddress
        )}, Min: ${minBalance}, Max: ${maxBalance}`,
      };
    });
    if (ruleOptions.length === 0) {
      await interaction.followUp({
        content: 'No rules active',
      });
      return;
    }

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(deleteRuleId)
        .setPlaceholder('Select a rule to delete')
        .addOptions(ruleOptions)
    );

    await interaction.followUp({
      content: 'Select the rule you want to delete:',
      components: [row],
    });
    return;
  },
};

export async function handleDeleteRule(interaction: SelectMenuInteraction) {
  const [selectedRuleId] = interaction.values;

  const ruleDocRef = doc(
    useAppContext().firebase.rulesOfGuild(interaction.guild.id),
    selectedRuleId
  );
  const ruleSnapshot = await getDoc(ruleDocRef);
  await deleteDoc(ruleDocRef);
  const { roleId, tokenAddress, minBalance, maxBalance } = ruleSnapshot.data();
  const role = interaction.guild.roles.cache.get(roleId);

  await interaction.reply({
    content: `Deleted rule: ${formatRule({
      role: role.name,
      tokenAddress,
      minBalance,
      maxBalance,
    })}`,
  });
}
