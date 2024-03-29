import {
    ChatInputApplicationCommandData, CommandInteraction, Client, PermissionFlagsBits,
    // ApplicationCommandOptionType
} from 'discord.js';

// Importing all commands func and names 
import { listRulesCommand } from './listRules';
import { listRuleForRoleCommandName, listRulesForRoleCommand } from './listRulesForRole';
import { deleteRuleCommandName, deleteRuleCommand } from './deleteRule';
import { addRuleCommandName, addRuleCommand } from './addRule';

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: CommandInteraction) => Promise<void>;
}

const AddRule: Command = {
    name: addRuleCommandName,
    description: 'Assign a role based on owned balances',
    run: addRuleCommand,
    // options: [
    //     {
    //         name: addRuleNrOfNfts,
    //         description: 'Number of NFTs related required',
    //         type: ApplicationCommandOptionType.Integer,
    //         minValue: 1,
    //         maxValue: 3
    //     }
    // ],
    defaultMemberPermissions: PermissionFlagsBits.Administrator
};

const DeleteRule: Command = {
    name: deleteRuleCommandName,
    description: 'Delete a starkbot rule',
    run: deleteRuleCommand,
    defaultMemberPermissions: PermissionFlagsBits.Administrator
};

const ListRules: Command = {
    name: 'starkbot-list-rules',
    description: 'List all starkbot rules',
    run: listRulesCommand
};

const ListRulesForRole: Command = {
    name: listRuleForRoleCommandName,
    description: 'List all starkbot rules for a specific role',
    run: listRulesForRoleCommand
};

// Exporting all commands 
export const commandList = [AddRule, DeleteRule, ListRules, ListRulesForRole];
