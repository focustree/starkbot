import {
  BaseCommandInteraction,
  ChatInputApplicationCommandData,
  Client,
} from 'discord.js';
import { Hello } from './hello';

export interface Command extends ChatInputApplicationCommandData {
  run: (client: Client, interaction: BaseCommandInteraction) => void;
}

export const commands: Command[] = [Hello];
