import { ModalSubmitInteraction } from "discord.js";
import { addRuleCommandName, handleAddRuleSubmitModal } from "../../commands/addRule";

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
    switch (interaction.customId) {
        case addRuleCommandName:
            await handleAddRuleSubmitModal(interaction);
            return;
        default:
            console.log(`Modal for "${interaction.customId}" isn't supported yet`)
    }
}