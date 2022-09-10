import { ButtonInteraction } from "discord.js";
import { deleteRuleId, keepRoleFromUserButtonId, removeRoleFromUserButtonId } from "../../commands/deleteRule";

export async function handleButton(interaction: ButtonInteraction) {
    switch (interaction.customId) {
        case keepRoleFromUserButtonId:
            // TODO 
            // await askKeepOrRemoveRole(interaction);
            return;
        case removeRoleFromUserButtonId:
            // await askKeepOrRemoveRole(interaction);
            return;
        default:
            console.log(`Button for "${interaction.customId}" isn't supported yet`)
    }
}