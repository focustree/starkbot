import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { config } from '../configuration/config';
import { fromIni } from "@aws-sdk/credential-providers";

const credentials = fromIni({
    profile: config.awsDBprofile,
});

const ddbClient = new DynamoDBClient({ region: config.awsRegion, credentials });
export { ddbClient };