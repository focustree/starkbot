import { BaseInteraction, Role } from "discord.js";

export function formatRule(role: string, ruleName: string, tokenAddress: string, minBalance: number, maxBalance: number, nbOfUsers?: number) {
  let userString = 'user';
  if (nbOfUsers > 1) userString += 's';
  return `\`\`\`
  Rule "${ruleName}" (${tokenAddress}) for role "${role}" has ${nbOfUsers ? (nbOfUsers.toString()) : '0'} ${userString}:
    • Min Balance: ${minBalance}
    • Max Balance: ${maxBalance}\`\`\``;
}

export function formatShortTokenAddress(tokenAddress: string) {
  return tokenAddress.slice(0, 6) + '...' + tokenAddress.slice(-4);
}


export async function numberOfUserWithRole(interaction: BaseInteraction, role: Role): Promise<number> {
  let usersWithRole = (await interaction.guild.members.fetch()).filter(member => member.roles.cache.has(role["id"]))
  return usersWithRole.size
}