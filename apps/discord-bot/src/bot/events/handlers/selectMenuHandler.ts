import { SelectMenuInteraction } from "discord.js";
import { addRuleRoleId, handleAddRuleSelectRole } from "../../commands/addRule";
import { askKeepOrRemoveRole, deleteRuleId } from "../../commands/deleteRule";


export async function handleSelectMenu(interaction: SelectMenuInteraction) {
    switch (interaction.customId) {
        case deleteRuleId:
            await askKeepOrRemoveRole(interaction);
            return;
        case addRuleRoleId:
            await handleAddRuleSelectRole(interaction);
            return;
        default:
            console.log(`Select for "${interaction.customId}" isn't supported yet`)
    }
}
