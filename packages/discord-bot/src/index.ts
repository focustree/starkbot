import { Client, Intents } from 'discord.js';
import { onInteractionCreate } from './bot/listeners/onInteractionCreate';
import { onReady } from './bot/listeners/onReady';
import { fetchDiscordMembers } from './fetchDiscordMembers';
import { getConfig } from './utils';

const startBot = async () => {
  const token = getConfig('DISCORD_BOT_TOKEN');
  const clientId = getConfig('DISCORD_CLIENT_ID');

  const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=0&scope=bot%20applications.commands`;
  console.log(`Invite link: ${inviteLink}`);

  const client = new Client({
    intents: [Intents.FLAGS.GUILD_MEMBERS],
  });
  onReady(client);
  onInteractionCreate(client);

  console.log('Bot is starting...');
  await client.login(token);

  await Promise.all([fetchDiscordMembers(client)]);
};

startBot();
