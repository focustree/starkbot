import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { config } from '../configuration/config';

const ddbClient = new DynamoDBClient({ region: config.awsRegion });
export { ddbClient };