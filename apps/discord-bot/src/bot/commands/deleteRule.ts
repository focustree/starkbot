import { useAppContext } from '@starkbot/discord-bot';
import {
  CommandInteraction,
  Client,
  SelectMenuInteraction,
  ButtonBuilder,
  ButtonStyle,
  Role,
  ButtonInteraction,
} from 'discord.js';
const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

import { deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { formatRule, formatShortTokenAddress } from './utils';

const ROLE_TO_DELETE_CACHE_ID = 'role-to-dete-cache-id';

let currentRuleIdToDelete: string;

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
  const { ruleId, role, numberOfUsers } = await getRuleInfo(interaction)
  currentRuleIdToDelete = ruleId;
  await interaction.reply({ content: `Should I remove the role "${role.name}" assigned to ${numberOfUsers} user?`, components: [row] });
}

export async function handleDeleteRule(interaction: ButtonInteraction, shouldRemoveRole: boolean) {
  const ruleDocRef = doc(
    useAppContext().firebase.rulesOfGuild(interaction.guild.id),
    currentRuleIdToDelete
  );
  const ruleSnapshot = await getDoc(ruleDocRef);
  const rule = ruleSnapshot.data();
  const role = interaction.guild.roles.cache.get(ruleSnapshot.data().roleId);

  if (shouldRemoveRole) {
    console.log("1shouldRemoveRole")
    await removeRoleToUsers(interaction, role)
  }
  await deleteDoc(ruleDocRef);

  await interaction.reply({
    content: `Deleted rule: ${formatRule({
      role: role.name,
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
  (await interaction.guild.members.cache.forEach(member => member.roles.remove(role)))
}

async function getAllRules(interaction: CommandInteraction) {
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
  return ruleOptions
}

async function getRuleInfo(interaction: SelectMenuInteraction) {
  const [selectedRuleId] = interaction.values;
  const ruleDocRef = doc(
    useAppContext().firebase.rulesOfGuild(interaction.guild.id),
    selectedRuleId
  )
  const ruleSnapshot = await getDoc(ruleDocRef);
  const role = interaction.guild.roles.cache.get(ruleSnapshot.data().roleId);
  let usersWithRoleSize = await numberOfUserWithRole(interaction, role);
  return { ruleId: selectedRuleId, role, numberOfUsers: usersWithRoleSize }
}

async function numberOfUserWithRole(interaction: SelectMenuInteraction, role: Role) {
  let usersWithRole = (await interaction.guild.members.fetch()).filter(member => member.roles.cache.has(role.id))
  return usersWithRole.size
}