import {
  BaseCommandInteraction,
  Client,
  MessageActionRow,
  MessageSelectMenu,
  Modal,
  ModalActionRowComponent,
  ModalSubmitInteraction,
  TextInputComponent,
} from 'discord.js';
import { Command } from '..';

export const addRuleId = 'starkbot-add-rule';
const tokenAddressId = 'tokenAdress';
const roleId = 'role';

export const AddRule: Command = {
  name: addRuleId,
  description: 'Assign a role based on owned NFTs',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const modal = new Modal()
      .setCustomId(addRuleId)
      .setTitle('Add Rule')
      .addComponents(
        new MessageActionRow<ModalActionRowComponent>().addComponents(
          new TextInputComponent()
            .setCustomId(tokenAddressId)
            .setLabel('Token contract address')
            .setStyle('SHORT')
        ),
        new MessageActionRow<ModalActionRowComponent>().addComponents(
          new MessageSelectMenu()
            .setCustomId(roleId)
            .setPlaceholder('Select role')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
              { label: 'Admin', value: 'admin' },
              { label: 'User', value: 'user' },
            ])
        )
      );

    await interaction.showModal(modal);
  },
};

export async function handleAddRule(interaction: ModalSubmitInteraction) {
  const tokenAddress = interaction.fields.getTextInputValue(tokenAddressId);
  const role = interaction.fields.getField(roleId).value;
  console.log({ tokenAddress, role });
  await interaction.reply({
    content: 'Thanks for the info!',
    ephemeral: true,
  });
}
