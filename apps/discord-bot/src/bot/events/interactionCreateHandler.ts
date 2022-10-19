import { Client } from 'discord.js';
import { handleButton } from './handlers/buttonHandler';
import { handleCommand } from './handlers/commandHandler';
import { handleModalSubmit } from './handlers/modalHandler';
import { handleSelectMenu } from './handlers/selectMenuHandler';


export function onInteractionCreate(client: Client): void {
  client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
      await handleCommand(client, interaction);
      return;
    }
    if (interaction.isSelectMenu()) {
      await handleSelectMenu(interaction)
      return
    }
    if (interaction.isButton()) {
      await handleButton(interaction)
      return

    }
    if (interaction.isModalSubmit()) {
      await handleModalSubmit(interaction)
      return;
    }
  });
}