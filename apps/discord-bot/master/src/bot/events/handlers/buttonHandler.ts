import { logger } from "apps/discord-bot/master/src/configuration/logger";
import { ButtonInteraction } from "discord.js";
import { handleDeleteRule, keepRoleFromUserButtonId, removeRoleFromUserButtonId } from "../../commands/deleteRule";

export async function handleButton(interaction: ButtonInteraction) {
    switch (interaction.customId) {
        case keepRoleFromUserButtonId:
            await handleDeleteRule(interaction, false);
            return;
        case removeRoleFromUserButtonId:
            await handleDeleteRule(interaction, true);
            return;
        default:
            logger.warn(`${interaction.guild.name}: Button for "${interaction.customId}" isn't supported yet`)
    }
}