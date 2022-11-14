import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { config } from '../configuration/config';
import { fromEnv } from "@aws-sdk/credential-providers";

const credentials = fromEnv();

const ddbClient = new DynamoDBClient({ region: config.awsRegion, credentials });
export { ddbClient };