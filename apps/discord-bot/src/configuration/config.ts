import { FirebaseOptions } from 'firebase/app';
import { logger } from './logger';
require("dotenv").config()

export const config = {
  env: process.env.ENV,
  // Discord
  discordToken: process.env.DISCORD_BOT_TOKEN,
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordInviteLink: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=0&scope=bot%20applications.commands`,
  // Firebase
  firebaseConfig: JSON.parse(process.env.FIREBASE_CONFIG) as FirebaseOptions,
  useLocalFirebase: process.env.USE_LOCAL_FIREBASE === 'true',
  // Starknet ID
  starknetIdContractAddress: process.env.STARKNET_ID_CONTRACT_ADDRESS,
  starknetIdIndexerUrl: process.env.STARKNET_ID_INDEXER_URL,
  verifierDecimalContractAddress: process.env.VERIFIER_DECIMAL_CONTRACT_ADDRESS,
  discordType: process.env.DISCORD_TYPE,
  awsRegion: process.env.AWS_REGION,
};

export type Config = typeof config;

export function safePrintConfig() {
  const safeConfig = { ...config };
  delete safeConfig.firebaseConfig;
  delete safeConfig.discordToken;
  safeConfig['firebaseProjectId'] = config.firebaseConfig.projectId;
  logger.info('Config:', safeConfig);
}
