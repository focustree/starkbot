import { Client } from 'discord.js';

export function onReady(client: Client): void {
  client.once('ready', () => {
    console.log(`${client.user.username} is online`);
  });
}
