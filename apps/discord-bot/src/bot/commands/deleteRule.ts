import { useAppContext } from '@starkbot/discord-bot';

import {
  CommandInteraction,
  Client,
  SelectMenuInteraction,
  Role,
  ButtonInteraction,
  BaseInteraction,
} from 'discord.js';
const { ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

import { deleteRuleForGuild, getRuleForGuild, getRulesForGuild } from '../../models/rule';
import { formatRule, formatShortTokenAddress, numberOfUserWithRole } from './utils';

const cache = new Map<string, string>();

export const deleteRuleCommandName = 'starkbot-delete-rule';
export const deleteRuleId = `${deleteRuleCommandName}-role`;
export const removeRoleFromUserButtonId = `${deleteRuleCommandName}-role-delete`;
export const keepRoleFromUserButtonId = `${deleteRuleCommandName}-role-keep`;

export async function deleteRuleCommand(client: Client, interaction: CommandInteraction) {
  await interaction.deferReply();

  let ruleOptions = await getAllRules(interaction);

  if (ruleOptions.length === 0) {
    await interaction.followUp({
      content: 'No rules active',
    });
    return;
  }
  const row = new ActionRowBuilder().addComponents(
    new SelectMenuBuilder()
      .setCustomId(deleteRuleId)
      .setPlaceholder('Select a rule to delete')
      .addOptions(ruleOptions)
  );

  await interaction.followUp({
    content: 'Select the rule you want to delete:',
    components: [row],
  });
  return;
}

export async function askKeepOrRemoveRole(interaction: SelectMenuInteraction) {
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(removeRoleFromUserButtonId)
        .setLabel('Remove role to user')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(keepRoleFromUserButtonId)
        .setLabel('Keep assigned role')
        .setStyle(ButtonStyle.Success),
    );
  const [selectedRuleId] = interaction.values;
  const { ruleId, role, nbOfUsers } = await getRuleInfo(interaction, selectedRuleId)

  cache.set(interaction.member.user.id, ruleId);

  await interaction.reply({ content: `Should I remove the role "${role.name}" assigned to ${nbOfUsers} user(s)?`, components: [row] });
}

export async function handleDeleteRule(interaction: ButtonInteraction, shouldRemoveRole: boolean) {

  const currentRuleIdToDelete = cache.get(interaction.member.user.id);
  let { nbOfUsers } = await getRuleInfo(interaction, currentRuleIdToDelete);
  const rule = await deleteRuleForGuild(interaction.guild, currentRuleIdToDelete)
  const role = interaction.guild.roles.cache.get(rule.roleId);

  if (shouldRemoveRole) {
    await removeRoleToUsers(interaction, role)
    nbOfUsers = 0;
  }

  cache.delete(currentRuleIdToDelete);

  await interaction.reply({
    content: `Deleted rule: ${formatRule({
      role: role.name,
      nbOfUsers,
      tokenAddress: rule.tokenAddress,
      minBalance: rule.minBalance,
      maxBalance: rule.maxBalance,
    })}`,
  });
}

// We can not simply delete the role as a role can be assign to a user for other reason
// But we can remove it to the user.
// If the user should still have due to another rule, itshould be applied by the loop that check rules 
async function removeRoleToUsers(interaction: ButtonInteraction, role: Role) {
  interaction.guild.members.cache.forEach(member => member.roles.remove(role))
}

async function getAllRules(interaction: CommandInteraction) {
  const ruleOptions = (await getRulesForGuild(interaction.guild)).map((doc) => {
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
  return ruleOptions
}

async function getRuleInfo(interaction: BaseInteraction, ruleId: string) {
  const rule = await getRuleForGuild(interaction.guild, ruleId)
  const role = interaction.guild.roles.cache.get(rule.roleId);
  let usersWithRoleSize = await numberOfUserWithRole(interaction, role);
  return { ruleId: ruleId, role, nbOfUsers: usersWithRoleSize }
}
