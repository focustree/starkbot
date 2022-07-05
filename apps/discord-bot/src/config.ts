import { FirebaseOptions } from 'firebase/app';
import { getConfig } from './utils';

export const config = {
  env: getConfig('ENV'),
  discordToken: getConfig('DISCORD_BOT_TOKEN'),
  discordClientId: getConfig('DISCORD_CLIENT_ID'),
  discordInviteLink: '',
  firebaseConfig: JSON.parse(getConfig('FIREBASE_CONFIG')) as FirebaseOptions,
};
config.discordInviteLink = `https://discord.com/api/oauth2/authorize?client_id=${config.discordClientId}&permissions=0&scope=bot%20applications.commands`;

export type Config = typeof config;
