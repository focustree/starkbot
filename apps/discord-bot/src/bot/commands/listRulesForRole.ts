import { CommandInteraction, Client, SelectMenuInteraction } from 'discord.js';
import { DiscordRule } from '../../dynamodb/db-types';
import { getRulesForGuild } from '../../models/rule';
import { formatRule, numberOfUserWithRole } from './utils';
import { listRulesCommandFor } from './listRules';


const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

export const listRuleForRoleCommandName = 'starkbot-list-rules-for-role'
export const listRuleForRoleId = `${listRuleForRoleCommandName}-role`;

export async function listRulesForRoleCommand(client: Client, interaction: CommandInteraction) {
  await interaction.deferReply();
  const ruleDocs = await getRulesForGuild(interaction.guild);
  if (ruleDocs.length == 0) {
    await interaction.followUp({
      content: `You have no active rules`
    });
    return
  }
  const roleOptions = interaction.guild.roles.cache.map((role) => ({
    label: role.name,
    value: role.id,
  }));
  const row = new ActionRowBuilder().addComponents(
    new SelectMenuBuilder()
      .setCustomId(listRuleForRoleId)
      .setPlaceholder('Select a role')
      .addOptions(roleOptions)
  );

  await interaction.followUp({
    content: 'Select the role you want to list',
    components: [row],
  });
  return;
}

export async function listRulesForRole(interaction: SelectMenuInteraction) {
  await interaction.deferReply();
  const [selectedRoleId] = interaction.values;
  let ruleDocs: DiscordRule[] = await getRulesForGuild(interaction.guild);
  ruleDocs = ruleDocs.filter(doc => doc.roleId == selectedRoleId);
  await listRulesCommandFor(interaction, ruleDocs);
}

