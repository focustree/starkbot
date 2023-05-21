import { logger } from "../../../../../configuration/logger";
import { IllegalArgumentException } from "apps/discord-bot/master/src/errors/illegalArgumentError";
import { ModalSubmitInteraction } from "discord.js";
import { addRuleCommandName, handleAddRuleSubmitModal } from "../../commands/addRule";

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
    try {
        switch (interaction.customId) {
            case addRuleCommandName:
                await handleAddRuleSubmitModal(interaction);
                return;
            default:
                logger.warn(`Modal for "${interaction.customId}" isn't supported yet`)
        }
    } catch (error) {
        if (error instanceof IllegalArgumentException) {
            logger.warn(error.message);
            await interaction.reply({
                content: error.message,
            });
        } else {
            logger.error(error)
        }
    }
}