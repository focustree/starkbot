import { Client, CommandInteraction, Interaction } from 'discord.js';
import { Command, commands } from '..';
import { addRuleId, handleAddRule } from '../commands/addRule';

export function onInteractionCreate(client: Client): void {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      await handleCommand(client, interaction);
      return;
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === addRuleId) {
        await handleAddRule(interaction);
        return;
      }
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
