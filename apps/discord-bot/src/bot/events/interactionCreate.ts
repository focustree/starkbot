import { Client, CommandInteraction, Interaction } from 'discord.js';
import { Command, commands } from '..';

export function onInteractionCreate(client: Client): void {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      await handleCommand(client, interaction);
    } else if (interaction.isModalSubmit()) {
      const favoriteColor =
        interaction.fields.getTextInputValue('favoriteColorInput');
      const hobbies = interaction.fields.getTextInputValue('hobbiesInput');
      console.log({ favoriteColor, hobbies });
      await interaction.reply({
        content: 'Thanks for the info!',
        ephemeral: true,
      });
    }
  });
}

async function handleCommand(
  client: Client,
  interaction: CommandInteraction
): Promise<void> {
  const command = commands.find((c) => c.name === interaction.command.name);
  if (!command) return;

  try {
    console.log(`Running command: ${command.name}`);
    await command.run(client, interaction);
  } catch (error) {
    console.error(error);
    interaction.followUp({
      content: 'An error has occurred',
      ephemeral: true,
    });
  }
}
