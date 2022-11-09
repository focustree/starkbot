import { logger } from './logger';
require("dotenv").config()

let dynamodbConfig;

if(process.env.ENV == "dev") {
  dynamodbConfig = {
    dynamodbTableGuild: process.env.DYNAMODB_TABLE_GUILD_DEV,
    dynamodbTableStarknetId: process.env.DYNAMODB_TABLE_STARKNET_ID_DEV,
  }
} else if(process.env.ENV == "prod") {
  dynamodbConfig = {
    dynamodbTableGuild: process.env.DYNAMODB_TABLE_GUILD_PROD,
    dynamodbTableStarknetId: process.env.DYNAMODB_TABLE_STARKNET_ID_PROD,
  }
}

export const config = {
  // Discord
  discordToken: process.env.DISCORD_BOT_TOKEN,
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordInviteLink: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=0&scope=bot%20applications.commands`,
  discordType: process.env.DISCORD_TYPE,
  // Starknet ID
  starknetIdContractAddress: process.env.STARKNET_ID_CONTRACT_ADDRESS,
  starknetIdIndexerUrl: process.env.STARKNET_ID_INDEXER_URL,
  verifierDecimalContractAddress: process.env.VERIFIER_DECIMAL_CONTRACT_ADDRESS,
  // AWS
  awsRegion: process.env.AWS_REGION,
  ...dynamodbConfig
};

export type Config = typeof config;

export function safePrintConfig() {
  const safeConfig = { ...config };
  delete safeConfig.discordToken;
  delete safeConfig.awsRegion;
  delete safeConfig.dynamodbTableGuild;
  delete safeConfig.dynamodbTableStarknetId;
  logger.info('Config:', safeConfig);
}
