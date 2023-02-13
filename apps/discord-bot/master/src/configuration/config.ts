import { logger } from './logger';
require("dotenv").config();

let dynamodbConfig;
let discordConfig;

if(process.env.ENV == "dev") {
  dynamodbConfig = {
    dynamodbTableGuild: process.env.DYNAMODB_TABLE_GUILD_DEV,
    dynamodbTableStarknetId: process.env.DYNAMODB_TABLE_STARKNET_ID_DEV,
    awsDBprofile: process.env.AWS_DB_DEV_PROFILE,
  };
  discordConfig = {
    discordToken: process.env.DISCORD_BOT_TOKEN_DEV,
    discordClientId: process.env.DISCORD_CLIENT_ID_DEV,
    discordInviteLink: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID_DEV}&permissions=268435456&scope=bot%20applications.commands`,
  };
} else if(process.env.ENV == "prod") {
  dynamodbConfig = {
    dynamodbTableGuild: process.env.DYNAMODB_TABLE_GUILD_PROD,
    dynamodbTableStarknetId: process.env.DYNAMODB_TABLE_STARKNET_ID_PROD,
    awsDBprofile: process.env.AWS_DB_PROD_PROFILE,
  };
  discordConfig = {
    discordToken: process.env.DISCORD_BOT_TOKEN_PROD,
    discordClientId: process.env.DISCORD_CLIENT_ID_PROD,
    discordInviteLink: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID_PROD}&permissions=268435456&scope=bot%20applications.commands`,
  };
}

export const config = {
  // Discord ID
  discordType: process.env.DISCORD_TYPE,
  // Starknet ID
  starknetIdContractAddress: process.env.STARKNET_ID_CONTRACT_ADDRESS,
  starknetIdIndexerUrl: process.env.STARKNET_ID_INDEXER_URL,
  verifierDecimalContractAddress: process.env.VERIFIER_DECIMAL_CONTRACT_ADDRESS,
  // AWS
  awsRegion: process.env.AWS_REGION,
  // DynamoDB
  ...dynamodbConfig,
  // Discord
  ...discordConfig,
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
