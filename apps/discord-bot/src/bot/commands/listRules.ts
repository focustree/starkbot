import { CommandInteraction, Client } from 'discord.js';
import { getRulesForGuild } from '../../models/rule';
import { formatRule, numberOfUserWithRole } from './utils';

export async function listRulesCommand(client: Client, interaction: CommandInteraction) {
  await interaction.deferReply();
  const ruleDocs = await getRulesForGuild(interaction.guild);
  if (ruleDocs.length == 0) {
    await interaction.followUp({
      content: `You have no active rules`
    });
    return;
  }

  const rules = await Promise.all(
    ruleDocs.map(async (doc) => {
      const { roleId, tokenAddress, minBalance, maxBalance } = doc.data();
      const role = interaction.guild.roles.cache.get(roleId);
      const nbOfUsers = await numberOfUserWithRole(interaction, role);
      return { role: role.name, nbOfUsers, tokenAddress, minBalance, maxBalance };
    }));

  await interaction.followUp({
    content: `You have ${rules.length} active rules: \n${rules
      .map((rule) => formatRule(rule))
      .join('\n')}`,
  });
  return;
}

