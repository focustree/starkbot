import { Client } from 'discord.js';

export function onReady(client: Client): void {
  client.on('ready', async () => {
    console.log(`${client.user.username} is online`);
  });
}
