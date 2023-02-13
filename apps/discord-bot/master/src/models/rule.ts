import { BaseGuild, Guild } from "discord.js";
import { getItem } from "../../../dynamodb/dynamodb";
import { addSubItem, getSubItem, deleteSubItem } from "../../../dynamodb/dynamo-item"
import { logger } from '../configuration/logger';
import { DiscordRule, dynamoQueryResponse } from "../../../dynamodb/db-types";


export async function createRuleForGuild(guild: Guild, selectedRoleId: string, ruleName: string, tokenAddress: string, minBalance: number, maxBalance: number, ruleid: string) {
  const responseRule: dynamoQueryResponse = await addSubItem("guild", { "guild-id": guild.id }, "Rules", "RuleSet", ruleid, {
    "id": ruleid,
    "roleId": selectedRoleId,
    "name": ruleName,
    "tokenAddress": tokenAddress,
    "minBalance": minBalance,
    "maxBalance": maxBalance,
  });
  if (responseRule.response) {
    logger.info(`Added new rule: ${ruleid}`);
  }
}

export async function getRulesForGuild(guild: BaseGuild): Promise<DiscordRule[]> {
  const rulesSnapshot: dynamoQueryResponse = await getItem("guild", { "guild-id": guild.id });
  if (rulesSnapshot.response) {
    return rulesSnapshot.data.Rules;
  }
  return null;
}

export async function getRuleForGuild(guild: Guild, id: string): Promise<DiscordRule> {
  return (await getSubItem("guild", { "guild-id": guild.id }, "Rules", id)).data;
}

export async function deleteRuleForGuild(guild: Guild, id: string): Promise<DiscordRule> {
  return (await deleteSubItem("guild", { "guild-id": guild.id }, "Rules", "RuleSet", id)).data;
}
