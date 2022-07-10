import { useAppContext } from '@starkbot/discord-bot';
import {
  BaseCommandInteraction,
  Client,
  MessageActionRow,
  MessageSelectMenu,
  Modal,
  ModalActionRowComponent,
  ModalSubmitInteraction,
  SelectMenuInteraction,
  TextInputComponent,
} from 'discord.js';
import { doc, setDoc } from 'firebase/firestore';
import { number } from 'starknet';
import { Command } from '..';
import { formatRule } from '../../utils';

export const addRuleCommandName = 'starkbot-add-rule';
export const addRuleRoleId = `${addRuleCommandName}-role`;
export const addRuleTokenAddressId = `${addRuleCommandName}-token-address`;
export const addRuleMinBalanceId = `${addRuleCommandName}-min-balance`;
export const addRuleMaxBalanceId = `${addRuleCommandName}-max-balance`;

const cache = new Map<string, string>();

export const AddRule: Command = {
  name: addRuleCommandName,
  description: 'Assign a role based on owned balances',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.deferReply();
    const roleOptions = interaction.guild.roles.cache.map((role) => ({
      label: role.name,
      value: role.id,
    }));
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(addRuleRoleId)
        .setPlaceholder('Select a role')
        .addOptions(roleOptions)
    );

    await interaction.followUp({
      content: 'Select the role you want to create a rule for:',
      components: [row],
    });
    return;
  },
};

export async function handleAddRuleSelectRole(
  interaction: SelectMenuInteraction
) {
  const [selectedRoleId] = interaction.values;
  const selectedRole = interaction.guild.roles.cache.get(selectedRoleId);

  const modal = new Modal()
    .setCustomId(addRuleCommandName)
    .setTitle(`Add a rule for ${selectedRole.name}`)
    .addComponents(
      new MessageActionRow<ModalActionRowComponent>().addComponents(
        new TextInputComponent()
          .setCustomId(addRuleTokenAddressId)
          .setLabel('Token contract address')
          .setStyle('SHORT')
      ),
      new MessageActionRow<ModalActionRowComponent>().addComponents(
        new TextInputComponent()
          .setCustomId(addRuleMinBalanceId)
          .setLabel('Minimum balance')
          .setStyle('SHORT')
      ),
      new MessageActionRow<ModalActionRowComponent>().addComponents(
        new TextInputComponent()
          .setCustomId(addRuleMaxBalanceId)
          .setLabel('Maximum balance')
          .setStyle('SHORT')
      )
    );

  cache.set(interaction.member.user.id, selectedRoleId);
  await interaction.showModal(modal);
}

export async function handleAddRuleSubmitModal(
  interaction: ModalSubmitInteraction
) {
  const selectedRoleId = cache.get(interaction.member.user.id);
  if (!selectedRoleId) {
    console.error('No role selected');
    await interaction.reply({
      content: 'No role selected',
    });
    return;
  }
  cache.delete(selectedRoleId);
  const selectedRole = interaction.guild.roles.cache.get(selectedRoleId);
  if (!selectedRole) {
    console.error('Role not found');
    await interaction.reply({
      content: 'Role not found',
    });
    return;
  }

  const tokenAddress = interaction.fields.getTextInputValue(
    addRuleTokenAddressId
  );
  if (tokenAddress == '') {
    console.error('No token address provided');
    await interaction.reply({
      content: '⚠️ No token address provided',
    });
    return;
  }
  if (!number.isHex(tokenAddress)) {
    console.error('Token adress is not a valid hex string');
    await interaction.reply({
      content: '⚠️ Token address is not a valid hex string',
    });
    return;
  }

  let minBalanceInput =
    interaction.fields.getTextInputValue(addRuleMinBalanceId);
  if (minBalanceInput == '') {
    console.error('Please provide a minimum balance');
    await interaction.reply({
      content: '⚠️ Please provide a minimum balance',
    });
    return;
  }
  const minBalance = parseInt(minBalanceInput);
  if (isNaN(minBalance) || minBalance < 0) {
    console.error(
      'Wrong value for minimum balance, positive integer is required'
    );
    await interaction.reply({
      content: 'Wrong value for minBalance',
    });
    return;
  }

  let maxBalanceInput =
    interaction.fields.getTextInputValue(addRuleMaxBalanceId);
  if (maxBalanceInput == '') {
    maxBalanceInput = `${Number.MAX_SAFE_INTEGER}`;
  }
  const maxBalance = parseInt(maxBalanceInput);
  if (isNaN(maxBalance) || maxBalance < 0) {
    console.error(
      'Wrong value for maximum balance, positive integer is required'
    );
    await interaction.reply({
      content: 'Wrong value for maxBalance',
    });
    return;
  }

  if (maxBalance < minBalance) {
    console.error('Maximum must be bigger than minimum');
    await interaction.reply({
      content: 'Min bigger than max',
    });
    return;
  }

  const { rulesOfGuild } = useAppContext().firebase;
  await setDoc(doc(rulesOfGuild(interaction.guild.id)), {
    roleId: selectedRoleId,
    tokenAddress,
    minBalance,
    maxBalance,
  });

  await interaction.reply({
    content: `Created new rule: ${formatRule({
      role: selectedRole.name,
      tokenAddress,
      minBalance,
      maxBalance,
    })}`,
  });
}
