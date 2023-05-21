import { Client } from 'discord.js';
import { logger } from '../../../../configuration/logger';

export function onReady(client: Client): void {
  client.once('ready', () => {
    logger.info(`${client.user.username} is online`);
  });
}
