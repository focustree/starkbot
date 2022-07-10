import { FirebaseOptions } from 'firebase/app';
import { getConfig } from './utils';

const discordClientId = getConfig('DISCORD_CLIENT_ID');

export const config = {
  env: getConfig('ENV'),
  // Discord
  discordToken: getConfig('DISCORD_BOT_TOKEN'),
  discordClientId,
  discordInviteLink: `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&permissions=0&scope=bot%20applications.commands`,
  // Firebase
  firebaseConfig: JSON.parse(getConfig('FIREBASE_CONFIG')) as FirebaseOptions,
  useLocalFirebase: process.env['USE_LOCAL_FIREBASE'] === 'true',
  // Starknet ID
  starknetIdContractAddress: getConfig('STARKNET_ID_CONTRACT_ADDRESS'),
  starknetIdIndexerUrl: getConfig('STARKNET_ID_INDEXER_URL'),
  verifierDecimalContractAddress: getConfig(
    'VERIFIER_DECIMAL_CONTRACT_ADDRESS'
  ),
  discordType: getConfig('DISCORD_TYPE'),
};

export type Config = typeof config;

export function safePrintConfig() {
  const safeConfig = { ...config };
  delete safeConfig.firebaseConfig;
  delete safeConfig.discordToken;
  safeConfig['firebaseProjectId'] = config.firebaseConfig.projectId;
  console.log('Config:', safeConfig);
}
