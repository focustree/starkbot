import { BaseCommandInteraction, Client } from 'discord.js';
import { Command } from '..';

export const Hello: Command = {
  name: 'hello',
  description: 'Returns a greeting',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.reply({
      ephemeral: true,
      content: 'Hello there ✨',
    });
  },
};
