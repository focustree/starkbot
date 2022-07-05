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
    const modal = new Modal().setCustomId('myModal').setTitle('My Modal');
    // Add components to modal
    // Create the text input components
    const favoriteColorInput = new TextInputComponent()
      .setCustomId('favoriteColorInput')
      // The label is the prompt the user sees for this input
      .setLabel("What's your favorite color?")
      // Short means only a single line of text
      .setStyle('SHORT');
    const hobbiesInput = new TextInputComponent()
      .setCustomId('hobbiesInput')
      .setLabel("What's some of your favorite hobbies?")
      // Paragraph means multiple lines of text.
      .setStyle('PARAGRAPH');
    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow =
      new MessageActionRow<ModalActionRowComponent>().addComponents(
        favoriteColorInput
      );
    const secondActionRow =
      new MessageActionRow<ModalActionRowComponent>().addComponents(
        hobbiesInput
      );
    // Add inputs to the modal
    modal.addComponents(firstActionRow, secondActionRow);
    // Show the modal to the user
    await interaction.showModal(modal);
  },
};
