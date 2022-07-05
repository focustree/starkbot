import {
  BaseCommandInteraction,
  ChatInputApplicationCommandData,
  Client,
} from 'discord.js';
import { Hello } from './hello';
import { AddTokenRule } from './addRule';

export interface Command extends ChatInputApplicationCommandData {
  run: (client: Client, interaction: BaseCommandInteraction) => void;
}

export const commands: Command[] = [Hello, AddTokenRule];
