import { Client } from 'discord.js';
import { commands } from '../commands';

export function onReady(client: Client): void {
  client.on('ready', async () => {
    if (!client.user || !client.application) {
      return;
    }

    await client.application.commands.set(commands);

    console.log(`${client.user.username} is online`);
  });
}
