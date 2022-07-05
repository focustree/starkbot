import { Client, Intents } from 'discord.js';
import { onInteractionCreate } from './bot/listeners/onInteractionCreate';
import { onReady } from './bot/listeners/onReady';
import { DiscordState } from './discord/discordState';
import { fetchDiscordMembers } from './discord/fetchDiscordMembers';
import { StarknetState } from './starknet/starknetState';
import { getConfig, schedule } from './utils';
import { initializeApp } from 'firebase/app';

const startBot = async () => {
  const token = getConfig('DISCORD_BOT_TOKEN');
  const clientId = getConfig('DISCORD_CLIENT_ID');
  const firebaseConfig = JSON.parse(getConfig('FIREBASE_CONFIG'));

  const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=0&scope=bot%20applications.commands`;
  console.log(`Invite link: ${inviteLink}`);

  const app = initializeApp(firebaseConfig);
  console.log(`Firebase app initialized: ${app.options.appId}`);

  const client = new Client({
    intents: [Intents.FLAGS.GUILD_MEMBERS],
  });
  onReady(client);
  onInteractionCreate(client);

  console.log('Bot is starting...');
  await client.login(token);

  const discordState = new DiscordState();
  const starknetState = new StarknetState();
  starknetState.updateUser({
    discordId: '244940825572802560',
    walletAddress: '0x1',
    ownedNFTs: new Set(),
  });
  starknetState.updateUser({
    discordId: '449645914416480257',
    walletAddress: '0x2',
    ownedNFTs: new Set(),
  });
  starknetState.updateUser({
    discordId: '946041152082182164',
    walletAddress: '0x3',
    ownedNFTs: new Set(),
  });
  starknetState.updateUser({
    discordId: '986383996227313725',
    walletAddress: '0x3',
    ownedNFTs: new Set(),
  });
  await Promise.all([
    schedule(() => fetchDiscordMembers({ client, discordState }), 5),
  ]);
};

startBot();
