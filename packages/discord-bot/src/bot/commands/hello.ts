import { BaseCommandInteraction, Client } from 'discord.js';
import { Command } from './index';

export const Hello: Command = {
  name: 'hello',
  description: 'Returns a greeting',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    console.log('hello command is running');
    const content = 'Hello there!';

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
