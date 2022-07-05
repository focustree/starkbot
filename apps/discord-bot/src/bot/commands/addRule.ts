import {
  BaseCommandInteraction,
  Client,
  MessageActionRow,
  Modal,
  ModalActionRowComponent,
  TextInputComponent,
} from 'discord.js';
import { Command } from '..';

export const AddRule: Command = {
  name: 'starkbot-add-rule',
  description: 'Assign a role based on owned NFTs',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const modal = new Modal().setCustomId('addRule').setTitle('Add Rule');

    const tokenAdressInput = new TextInputComponent()
      .setCustomId('tokenAddress')
      .setLabel('Token contract address')
      .setStyle('SHORT');

    modal.addComponents(
      new MessageActionRow<ModalActionRowComponent>().addComponents(
        tokenAdressInput
      )
    );

    await interaction.showModal(modal);
  },
};
