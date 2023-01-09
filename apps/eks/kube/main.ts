import { Construct } from 'constructs';
import { App, Chart, ChartProps, Duration, Size } from 'cdk8s';
import { Deployment, Volume, Secret, EnvValue, ISecret, Probe, Cpu } from 'cdk8s-plus-25';
require("dotenv").config();


export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    const starkbotEnvSecret : ISecret = new Secret(this, "starkbot-env-secret", {stringData: {
      ['ENV']: 'prod',
      ['DISCORD_CLIENT_ID_PROD']: returnString(process.env.DISCORD_CLIENT_ID_PROD),
      ['DISCORD_BOT_TOKEN_PROD']: returnString(process.env.DISCORD_BOT_TOKEN_PROD),
      ['STARKNET_ID_CONTRACT_ADDRESS']: returnString(process.env.STARKNET_ID_CONTRACT_ADDRESS),
      ['STARKNET_ID_INDEXER_URL']: returnString(process.env.STARKNET_ID_INDEXER_URL),
      ['VERIFIER_DECIMAL_CONTRACT_ADDRESS']: returnString(process.env.VERIFIER_DECIMAL_CONTRACT_ADDRESS),
      ['DISCORD_TYPE']: returnString(process.env.DISCORD_TYPE),
      ['AWS_DB_PROD_PROFILE']: returnString(process.env.AWS_DB_PROD_PROFILE),
      ['AWS_REGION']: returnString(process.env.AWS_REGION),
      ['DYNAMODB_TABLE_GUILD_PROD']: returnString(process.env.DYNAMODB_TABLE_GUILD_PROD),
      ['DYNAMODB_TABLE_STARKNET_ID_PROD']: returnString(process.env.DYNAMODB_TABLE_STARKNET_ID_PROD),
    }});

    const starkbotDeployment = new Deployment(this, "starkbot", {replicas: 1});

    const startupProbe = Probe.fromCommand( ["cat", "/.aws/credentials"], {
      timeoutSeconds: Duration.seconds(20),
    });

    starkbotDeployment.addContainer(
      {
        image: returnString(process.env.AWS_ACCOUNT_NUMBER + ".dkr.ecr." + process.env.AWS_REGION + ".amazonaws.com/" + process.env.AWS_PRINCIPAL_ECR),
        name: 'starkbot',
        port: 22,
        volumeMounts: [
          {
            path:'/tmp',
            volume:Volume.fromEmptyDir(scope, id="tmp-starkbot", 'tmp-starkbot'),
          },
        ],
        envVariables: {
          ['ENV']: EnvValue.fromSecretValue({key: 'ENV', secret: starkbotEnvSecret}),
          ['DISCORD_CLIENT_ID_PROD']: EnvValue.fromSecretValue({key: 'DISCORD_CLIENT_ID_PROD', secret: starkbotEnvSecret}),
          ['DISCORD_BOT_TOKEN_PROD']: EnvValue.fromSecretValue({key: 'DISCORD_BOT_TOKEN_PROD', secret: starkbotEnvSecret}),
          ['STARKNET_ID_CONTRACT_ADDRESS']: EnvValue.fromSecretValue({key: 'STARKNET_ID_CONTRACT_ADDRESS', secret: starkbotEnvSecret}),
          ['STARKNET_ID_INDEXER_URL']: EnvValue.fromSecretValue({key: 'STARKNET_ID_INDEXER_URL', secret: starkbotEnvSecret}),
          ['VERIFIER_DECIMAL_CONTRACT_ADDRESS']: EnvValue.fromSecretValue({key: 'VERIFIER_DECIMAL_CONTRACT_ADDRESS', secret: starkbotEnvSecret}),
          ['DISCORD_TYPE']: EnvValue.fromSecretValue({key: 'DISCORD_TYPE', secret: starkbotEnvSecret}),
          ['AWS_DB_PROD_PROFILE']: EnvValue.fromSecretValue({key: 'AWS_DB_PROD_PROFILE', secret: starkbotEnvSecret}),
          ['AWS_REGION']: EnvValue.fromSecretValue({key: 'AWS_REGION', secret: starkbotEnvSecret}),
          ['DYNAMODB_TABLE_GUILD_PROD']: EnvValue.fromSecretValue({key: 'DYNAMODB_TABLE_GUILD_PROD', secret: starkbotEnvSecret}),
          ['DYNAMODB_TABLE_STARKNET_ID_PROD']: EnvValue.fromSecretValue({key: 'DYNAMODB_TABLE_STARKNET_ID_PROD', secret: starkbotEnvSecret}),
        },
        startup: startupProbe,
        resources: {
          cpu: {
            request: Cpu.millis(1500),
            limit: Cpu.millis(2000)
          },
          memory: {
            request: Size.mebibytes(2048),
            limit: Size.mebibytes(4096)
          }
        }
      }
    )

  }
}

function returnString(maybeString: string | undefined): string {
  if(maybeString == null) {
    return "";
  } else {
    return maybeString;
  }
}

const app = new App();
new MyChart(app, 'kube');
app.synth();
