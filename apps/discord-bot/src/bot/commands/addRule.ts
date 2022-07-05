import { BaseCommandInteraction, Client, Modal } from 'discord.js';
import { Command } from './index';

export const AddTokenRule: Command = {
  name: 'starkbot-add-token-rule',
  description: 'Assign a role based on owned NFTs',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    console.log('starkbot-add-token-rule command is running');

    const modal = new Modal().setCustomId('myModal').setTitle('My Modal');
    await interaction.showModal(modal);

    await interaction.followUp({
      ephemeral: true,
      content: 'toto',
    });
  },
};
