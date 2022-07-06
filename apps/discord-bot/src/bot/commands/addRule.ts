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

  const { rulesOfGuild } = useAppContext().firebase;
  await setDoc(doc(rulesOfGuild(interaction.guild.id)), {
    roleId: selectedRoleId,
    tokenAddress,
  });

  await interaction.reply({
    content: `Created new rule: ${formatRule({
      role: selectedRole.name,
      tokenAddress,
    })}`,
    ephemeral: true,
  });
}
