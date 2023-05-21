import { logger } from "../../../../../configuration/logger";
import { addRuleRoleId, handleAddRuleSelectRole } from "../../commands/addRule";
import { askKeepOrRemoveRole, deleteRuleId } from "../../commands/deleteRule";
import { listRuleForRoleId, listRulesForRole } from "../../commands/listRulesForRole";


export async function handleSelectMenu(interaction) {
    switch (interaction.customId) {
        case deleteRuleId:
            await askKeepOrRemoveRole(interaction);
            return;
        case addRuleRoleId:
            await handleAddRuleSelectRole(interaction);
            return;
        case listRuleForRoleId:
            await listRulesForRole(interaction);
            return;
        default:
            logger.warn(`Select for "${interaction.customId}" isn't supported yet`)
    }
}
