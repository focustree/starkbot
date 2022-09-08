import {
    ChatInputApplicationCommandData,
    CommandInteraction,
    Client
} from 'discord.js';

// Importing all commands func and names 
import { listRulesCommand } from './listRules';
import { deleteRuleCommandName, deleteRuleCommand } from './deleteRule';
import { addRuleCommandName, addRuleCommand, addRuleNrOfNfts } from './addRule';
// import { editRuleCommandName, editRuleCommand } from './editRule';

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: CommandInteraction) => Promise<void>;
}

const AddRule: Command = {
    name: addRuleCommandName,
    description: 'Assign a role based on owned balances',
    run: addRuleCommand,
    options: [
        {
            name: addRuleNrOfNfts,
            description: 'Number of NFTs related required',
            type: 4, // Integer
            minValue: 1,
            maxValue: 3
        }
    ]
};

const DeleteRule: Command = {
    name: deleteRuleCommandName,
    description: 'Delete a starkbot rule',
    run: deleteRuleCommand
};

const ListRules: Command = {
    name: 'starkbot-list-rules',
    description: 'List all starkbot rules',
    run: listRulesCommand
};

// const EditRule: Command = {
//     name: editRuleCommandName,
//     description: 'Edit a starkbot rule',
//     run: editRuleCommand
// };



// Exporting all commands 
export const commandList = [AddRule, DeleteRule, ListRules];