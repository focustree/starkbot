import {
  CommandInteraction,
  Client,
  ModalSubmitInteraction,
  SelectMenuInteraction,
  Role,
} from 'discord.js';

import { number } from 'starknet';
import { IllegalArgumentException } from '../../errors/illegalArgumentError';
import { createRuleForGuild } from '../../models/rule';
import { formatRule } from './utils';

const DEFAULT_MIN_VALUE = 1;
const RANGE_ID = 1000000000000000000;

export const addRuleCommandName = 'starkbot-add-rule';
export const addRuleRoleId = `${addRuleCommandName}-role`;
export const addRuleTokenAddressId = `${addRuleCommandName}-token-address`;
export const addRuleMinBalanceId = `${addRuleCommandName}-min-balance`;
export const addRuleMaxBalanceId = `${addRuleCommandName}-max-balance`;
export const addRuleNrOfNfts = `${addRuleCommandName}-number-of-nfts`;

const { ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const cache = new Map<string, string>();

export async function addRuleCommand(client: Client, interaction: CommandInteraction) {
  await interaction.deferReply();
  const roleOptions = interaction.guild.roles.cache.map((role) => ({
    label: role.name,
    value: role.id,
  }));
  const row = new ActionRowBuilder().addComponents(
    new SelectMenuBuilder()
      .setCustomId(addRuleRoleId)
      .setPlaceholder('Select a role')
      .addOptions(roleOptions)
  );

  await interaction.followUp({
    content: 'Select the role you want to create a rule for:',
    components: [row],
  });
  return;
}

export async function handleAddRuleSelectRole(interaction: SelectMenuInteraction) {
  const [selectedRoleId] = interaction.values;
  const selectedRole = interaction.guild.roles.cache.get(selectedRoleId);
  const modal = new ModalBuilder()
    .setCustomId(addRuleCommandName)
    .setTitle(`Add a rule for ${selectedRole.name}`);

  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId(addRuleTokenAddressId)
        .setLabel('Token contract address')
        .setStyle(TextInputStyle.Short)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId(addRuleMinBalanceId)
        .setLabel(`Minimum balance (default ${DEFAULT_MIN_VALUE})`)
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId(addRuleMaxBalanceId)
        .setLabel(`Maximum balance (default ${Number.MAX_SAFE_INTEGER})`)
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
    )
  );
  cache.set(interaction.member.user.id, selectedRoleId);
  await interaction.showModal(modal);
}

export async function handleAddRuleSubmitModal(interaction: ModalSubmitInteraction) {

  const selectedRoleId = getSelectedRoleId(interaction);
  const selectedRole = getSelectedRole(interaction, selectedRoleId);
  const tokenAddress = getTokenAdress(interaction);
  const minBalance = getMinBalance(interaction);
  const maxBalance = getMaxBalance(interaction);

  if (maxBalance < minBalance) {
    throw new IllegalArgumentException('Maximum must be bigger than minimum')
  }
  cache.delete(selectedRoleId);

  await createRuleForGuild(interaction.guild, selectedRoleId, tokenAddress, minBalance, maxBalance, Math.floor(Math.random() * RANGE_ID).toString());

  await interaction.reply({
    content: `Created new rule: ${formatRule({
      role: selectedRole.name,
      tokenAddress,
      minBalance,
      maxBalance,
    })}`,
  });
}


function getSelectedRoleId(interaction: ModalSubmitInteraction): string {
  const selectedRoleId = cache.get(interaction.member.user.id);
  if (!selectedRoleId) {
    throw new IllegalArgumentException('No role selected');
  }
  return selectedRoleId;
}

function getSelectedRole(interaction: ModalSubmitInteraction, roleId: string): Role {
  const selectedRole = interaction.guild.roles.cache.get(roleId);
  if (!selectedRole) {
    throw new IllegalArgumentException('Role not found');
  }
  return selectedRole;
}


function getTokenAdress(interaction: ModalSubmitInteraction): string {
  const tokenAddress = interaction.fields.getTextInputValue(addRuleTokenAddressId).toLowerCase();
  if (tokenAddress == '') {
    throw new IllegalArgumentException('⚠️ No token address provided');
  }
  if (!number.isHex(tokenAddress)) {
    throw new IllegalArgumentException('⚠️ Token address is not a valid hex string');
  }
  return tokenAddress;
}

function getMinBalance(interaction: ModalSubmitInteraction): number {
  let minBalanceInput =
    interaction.fields.getTextInputValue(addRuleMinBalanceId);
  if (!minBalanceInput) {
    minBalanceInput = `${DEFAULT_MIN_VALUE}`;
  }
  const minBalance = parseInt(minBalanceInput);
  if (isNaN(minBalance) || minBalance < 1) {
    throw new IllegalArgumentException('Wrong value for minimum balance, positive integer is required');
  }
  return minBalance;
}

function getMaxBalance(interaction: ModalSubmitInteraction): number {
  let maxBalanceInput =
    interaction.fields.getTextInputValue(addRuleMaxBalanceId);
  if (!maxBalanceInput) {
    maxBalanceInput = `${Number.MAX_SAFE_INTEGER}`;
  }
  const maxBalance = parseInt(maxBalanceInput);
  if (isNaN(maxBalance) || maxBalance < 0) {
    throw new IllegalArgumentException('Wrong value for maximum balance, positive integer is required');
  }
  return maxBalance;
}
