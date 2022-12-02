import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import { AutoScaler } from './auto-scaler';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
require("dotenv").config();

export class EksSampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, id="eks-vpc");

    const worker_repository = new ecr.Repository(this, 'starkbot-ecr', {
      repositoryName: "starkbot-repository"
    });

    const base_repository = new ecr.Repository(this, 'starkbot-base-ecr', {
      repositoryName: "starkbot-base-repository"
    });
    
    const cluster = new eks.Cluster(this, id='starkbot-cluster', {
      clusterName: "starkbot-cluster",
      defaultCapacityInstance: new ec2.InstanceType("t3.medium"),
      vpc: vpc,
      defaultCapacity: 0,
      version: eks.KubernetesVersion.V1_21,
    });

    let username : string = "";

    if(process.env.AWS_NAME == null) {
      console.log("No user configured, please complete AWS_NAME in environment variables");
    } else {
      username = process.env.AWS_NAME;
    }

    const adminUser = iam.User.fromUserName(scope, 'admin-user', username);

    cluster.awsAuth.addUserMapping(adminUser, { groups: [ 'system:masters' ]});

    const nodegroup = cluster.addNodegroupCapacity("nodegroup", {
      instanceTypes: [new ec2.InstanceType("t3.medium")],
      minSize: 1,
      maxSize: 10,
    });

    const guildTableProd = new dynamodb.Table(this, 'starkbot-guilds-prod', {
      partitionKey : { name: 'guild-id', type: dynamodb.AttributeType.STRING },
    });

    const starknetIDTableProd = new dynamodb.Table(this, 'starkbot-starknet-ids-prod', {
      partitionKey : { name: 'starknet-id', type: dynamodb.AttributeType.STRING },
    });

    starknetIDTableProd.addGlobalSecondaryIndex({
      indexName: "MemberId-index",
      partitionKey: { name: "discordMemberId", type: dynamodb.AttributeType.STRING},
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const guildTableDev = new dynamodb.Table(this, 'starkbot-guilds-dev', {
      partitionKey : { name: 'guild-id', type: dynamodb.AttributeType.STRING },
    });

    const starknetIDTableDev = new dynamodb.Table(this, 'starkbot-starknet-ids-dev', {
      partitionKey : { name: 'starknet-id', type: dynamodb.AttributeType.STRING },
    });

    const websiteDev = new dynamodb.Table(this, 'website-dev', {
      partitionKey : { name: 'user-id', type: dynamodb.AttributeType.STRING },
    });

    starknetIDTableDev.addGlobalSecondaryIndex({
      indexName: "MemberId-index",
      partitionKey: { name: "discordMemberId", type: dynamodb.AttributeType.STRING},
      projectionType: dynamodb.ProjectionType.ALL,
    });

    AutoScaler.enableAutoscaling(this, cluster, nodegroup);

  }
}
