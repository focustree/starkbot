import { CommandInteraction, Client } from 'discord.js';
import { getRulesForGuild } from '../../models/rule';
import { formatRule, numberOfUserWithRole } from './utils';

export async function listRulesCommand(client: Client, interaction: CommandInteraction) {
  await interaction.deferReply();
  const ruleDocs = await getRulesForGuild(interaction.guild);
  if (ruleDocs == null) {
    await interaction.followUp({
      content: `You have no active rules`
    });
    return;
  }

  const rules = await Promise.all(
    ruleDocs.map(async (doc) => {
      const { roleId, name, tokenAddress, minBalance, maxBalance } = doc;
      const role = interaction.guild.roles.cache.get(roleId);
      const nbOfUsers = await numberOfUserWithRole(interaction, role);
      return { role: role.name, name, nbOfUsers, tokenAddress, minBalance, maxBalance };
    }));

  await interaction.followUp({
    content: `You have ${rules.length} active rules: \n${rules
      .map((rule) => formatRule(rule.role, rule.name, rule.tokenAddress, rule.minBalance, rule.maxBalance, rule.nbOfUsers))
      .join('\n')}`,
  });
  return;
}

