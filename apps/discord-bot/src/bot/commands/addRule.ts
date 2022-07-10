import { useAppContext } from '@starkbot/discord-bot';
import {
  BaseCommandInteraction,
  Client,
  MessageActionRow,
  MessageSelectMenu,
  Modal,
  ModalActionRowComponent,
  ModalSubmitInteraction,
  SelectMenuInteraction,
  TextInputComponent,
} from 'discord.js';
import { doc, setDoc } from 'firebase/firestore';
import { Command } from '..';
import { formatRule } from '../../utils';

export const addRuleCommandName = 'starkbot-add-rule';
export const addRuleRoleId = `${addRuleCommandName}-role`;
export const addRuleTokenAddressId = `${addRuleCommandName}-token-address`;
export const addRuleMinNFT = `${addRuleCommandName}-min-nft`;
export const addRuleMaxNFT = `${addRuleCommandName}-max-nft`;

const cache = new Map<string, string>();

export const AddRule: Command = {
  name: addRuleCommandName,
  description: 'Assign a role based on owned NFTs',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.deferReply();
    const roleOptions = interaction.guild.roles.cache.map((role) => ({
      label: role.name,
      value: role.id,
    }));
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(addRuleRoleId)
        .setPlaceholder('Select a role')
        .addOptions(roleOptions)
    );

    await interaction.followUp({
      content: 'Select the role you want to create a rule for:',
      components: [row],
    });
    return;
  },
};

export async function handleAddRuleSelectRole(
  interaction: SelectMenuInteraction
) {
  const [selectedRoleId] = interaction.values;
  const selectedRole = interaction.guild.roles.cache.get(selectedRoleId);

  const modal = new Modal()
    .setCustomId(addRuleCommandName)
    .setTitle(`Add a rule for ${selectedRole.name}`)
    .addComponents(
      new MessageActionRow<ModalActionRowComponent>().addComponents(
        new TextInputComponent()
          .setCustomId(addRuleTokenAddressId)
          .setLabel('Token contract address')
          .setStyle('SHORT')
      ),
      new MessageActionRow<ModalActionRowComponent>().addComponents(
        new TextInputComponent()
          .setCustomId(addRuleMinNFT)
          .setLabel('Minimum NFT to own for this role')
          .setStyle('SHORT')
      ),
      new MessageActionRow<ModalActionRowComponent>().addComponents(
        new TextInputComponent()
          .setCustomId(addRuleMaxNFT)
          .setLabel('Maximum NFT to own for this role')
          .setStyle('SHORT')
      )
    );

  cache.set(interaction.member.user.id, selectedRoleId);
  await interaction.showModal(modal);
}

export async function handleAddRuleSubmitModal(
  interaction: ModalSubmitInteraction
) {
  const selectedRoleId = cache.get(interaction.member.user.id);
  if (!selectedRoleId) {
    console.error('No role selected');
    await interaction.reply({
      content: 'No role selected',
      ephemeral: true,
    });
    return;
  }
  cache.delete(selectedRoleId);
  const selectedRole = interaction.guild.roles.cache.get(selectedRoleId);
  if (!selectedRole) {
    console.error('Role not found');
    await interaction.reply({
      content: 'Role not found',
      ephemeral: true,
    });
    return;
  }

  const tokenAddress = interaction.fields.getTextInputValue(
    addRuleTokenAddressId
  );

  const minNFT = parseInt(interaction.fields.getTextInputValue(
    addRuleMinNFT
  ));

  const maxNFT = parseInt(interaction.fields.getTextInputValue(
    addRuleMaxNFT
  ));

  if (minNFT == NaN || minNFT < 0) {
    console.error('Wrong value for minimum NFT, positive integer is required');
    await interaction.reply({
      content: 'Wrong value for minNFT',
      ephemeral: true,
    });
    return;
  }

  if (maxNFT == NaN || maxNFT < 0) {
    console.error('Wrong value for maximum NFT, positive integer is required');
    await interaction.reply({
      content: 'Wrong value for maxNFT',
      ephemeral: true,
    });
    return;
  }

  if (maxNFT < minNFT) {
    console.error('Maximum must be bigger than minimum');
    await interaction.reply({
      content: 'min bigger than max',
      ephemeral: true,
    });
    return;
  }

  const { rulesOfGuild } = useAppContext().firebase;
  await setDoc(doc(rulesOfGuild(interaction.guild.id)), {
    roleId: selectedRoleId,
    tokenAddress,
    minNFT,
    maxNFT,
  });

  await interaction.reply({
    content: `Created new rule: ${formatRule({
      role: selectedRole.name,
      tokenAddress,
      minNFT,
      maxNFT,
    })}`,
  });
}
