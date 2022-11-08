import { BaseGuild, Guild } from "discord.js";
import { getItem, addSubItem, getSubItem, deleteSubItem } from "../dynamodb";
import { logger } from '../configuration/logger';

export interface RuleDoc {
    roleId: string;
    tokenAddress: string;
    minBalance: number;
    maxBalance: number;
}

export async function createRuleForGuild(guild: Guild, selectedRoleId: string, tokenAddress: string, minBalance: number, maxBalance: number, ruleid : string) {
    const responseRule = await addSubItem("guild", { "guild-id": guild.id }, "Rules", "RuleSet", ruleid, {
        "id": ruleid,
        "roleId": selectedRoleId,
        "tokenAddress": tokenAddress,
        "minBalance": minBalance,
        "maxBalance": maxBalance,
    });
    if (responseRule.response) {
        logger.info(`Added new rule: ${ruleid}`);
    }
}

export async function getRulesForGuild(guild: BaseGuild) {
    const rulesSnapshot = await getItem("guild", { "guild-id": guild.id });
    return rulesSnapshot.data["Rules"];
}

export async function getRuleForGuild(guild: Guild, id: string) {
    const ruleSnapshot = await getSubItem("guild", { "guild-id": guild.id }, "Rules", id);
    return ruleSnapshot.data;
}

export async function deleteRuleForGuild(guild: Guild, id: string) {
    const deleteResponse = await deleteSubItem("guild", { "guild-id": guild.id }, "Rules", "RuleSet", id);
    return deleteResponse;
}
