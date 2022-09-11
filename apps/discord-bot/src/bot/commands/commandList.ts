import {
    ChatInputApplicationCommandData,
    CommandInteraction,
    Client
} from 'discord.js';

// Importing all commands func and names 
import { listRulesCommand } from './listRules';
import { deleteRuleCommandName, deleteRuleCommand } from './deleteRule';
import { addRuleCommandName, addRuleCommand, addRuleNrOfNfts } from './addRule';

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
            type: 4, // Integer, there is probably a better way to retrieve it using some glob var
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

// Exporting all commands 
export const commandList = [AddRule, DeleteRule, ListRules];