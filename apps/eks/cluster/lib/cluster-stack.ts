import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { AutoScaler } from './auto-scaler';
require("dotenv").config();

const region = process.env.AWS_REGION;
const aws_account_number = process.env.AWS_ACCOUNT_NUMBER;
const dynamoTableGuildDev = process.env.DYNAMODB_TABLE_GUILD_DEV;
const dynamoTableGuildProd = process.env.DYNAMODB_TABLE_GUILD_PROD;
const dynamoTableStarknetIDDev = process.env.DYNAMODB_TABLE_STARKNET_ID_DEV;
const dynamoTableStarknetIDProd = process.env.DYNAMODB_TABLE_STARKNET_ID_PROD;
const dynamoTableWebsiteDev = process.env.DYNAMO_TABLE_WEBSITE_DEV;
const dynamoTableWebsiteProd = process.env.DYNAMO_TABLE_WEBSITE_PROD;
const ecrBase = process.env.AWS_BASE_ECR;
const ecrPrincipal = process.env.AWS_PRINCIPAL_ECR;

const arnDynamoBase = "arn:aws:dynamodb:" + region + ":" + aws_account_number + ":table/"

export class DynamoBotStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new dynamodb.Table(this, 'starkbot-guilds-prod', {
      tableName : dynamoTableGuildProd,
      partitionKey : { name: 'guild-id', type: dynamodb.AttributeType.STRING },
    });

    const starknetIDTableProd = new dynamodb.Table(this, 'starkbot-starknet-ids-prod', {
      tableName : dynamoTableStarknetIDProd,
      partitionKey : { name: 'starknet-id', type: dynamodb.AttributeType.STRING },
    });

    starknetIDTableProd.addGlobalSecondaryIndex({
      indexName: "MemberId-index",
      partitionKey: { name: "discordMemberId", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });


    new dynamodb.Table(this, 'starkbot-guilds-dev', {
      tableName : dynamoTableGuildDev,
      partitionKey : { name: 'guild-id', type: dynamodb.AttributeType.STRING },
    });

    const starknetIDTableDev = new dynamodb.Table(this, 'starkbot-starknet-ids-dev', {
      tableName : dynamoTableStarknetIDDev,
      partitionKey : { name: 'starknet-id', type: dynamodb.AttributeType.STRING },
    });

    starknetIDTableDev.addGlobalSecondaryIndex({
      indexName: "MemberId-index",
      partitionKey: { name: "discordMemberId", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });


    let devUserName : string = "";
    if(process.env.AWS_DB_DEV_PROFILE == null) {
      console.log("No user configured, please complete AWS_DB_DEV_PROFILE in environment variables");
    } else {
      devUserName = process.env.AWS_DB_DEV_PROFILE;
    }
    const devUser = iam.User.fromUserName(this, "dev-user", devUserName);

    const authorizationsDev = new iam.PolicyStatement({
      actions: authorizationsActionsDynamo,
      resources: [arnDynamoBase + dynamoTableGuildDev, arnDynamoBase + dynamoTableStarknetIDDev, arnDynamoBase + dynamoTableStarknetIDDev + "/index/MemberId-index"]
    });

    new iam.Policy(this, "policy-db-dev", {
      users: [devUser],
      policyName: "Policy-dynamo-Dev",
      statements: [authorizationsDev]
    });


    let prodUserName : string = "";
    if(process.env.AWS_DB_PROD_PROFILE == null) {
      console.log("No user configured, please complete AWS_DB_PROD_PROFILE in environment variables");
    } else {
      prodUserName = process.env.AWS_DB_PROD_PROFILE;
    }
    const prodUser = iam.User.fromUserName(this, "prod-user", prodUserName);

    const authorizationsProd = new iam.PolicyStatement({
      actions: authorizationsActionsDynamo,
      resources: [arnDynamoBase + dynamoTableGuildProd, arnDynamoBase + dynamoTableStarknetIDProd, arnDynamoBase + dynamoTableStarknetIDProd + "/index/MemberId-index"]
    });

    new iam.Policy(this, "policy-db-prod", {
      users: [prodUser],
      policyName: "Policy-dynamo-Prod",
      statements: [authorizationsProd]
    });

  }
}

export class DynamoWebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new dynamodb.Table(this, 'website-dev', {
      tableName : dynamoTableWebsiteDev,
      partitionKey : { name: 'user-id', type: dynamodb.AttributeType.STRING },
    });

    new dynamodb.Table(this, 'website-prod', {
      tableName : dynamoTableWebsiteProd,
      partitionKey : { name: 'user-id', type: dynamodb.AttributeType.STRING },
    });

    let websiteUserName : string = "";
    if(process.env.AWS_WEB_PROFILE == null) {
      console.log("No user configured, please complete AWS_WEB_PROFILE in environment variables");
    } else {
      websiteUserName = process.env.AWS_WEB_PROFILE;
    }
    const websiteUser = iam.User.fromUserName(this, "website-user", websiteUserName);

    const authorizationsWeb = new iam.PolicyStatement({
      actions: authorizationsActionsDynamo,
      resources: [arnDynamoBase + dynamoTableWebsiteDev, arnDynamoBase + dynamoTableWebsiteProd]
    });

    new iam.Policy(this, "policy-db-website", {
      users: [websiteUser],
      policyName: "Policy-dynamo-Website",
      statements: [authorizationsWeb]
    });

  }
}

export class ECRStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const principalECR = new ecr.Repository(this, 'starkbot-ecr', {
      repositoryName: ecrPrincipal
    });

    const baseECR = new ecr.Repository(this, 'starkbot-base-ecr', {
      repositoryName: ecrBase
    });

    let ECRUserName : string = "";
    if(process.env.AWS_ECR_PROFILE == null) {
      console.log("No user configured, please complete AWS_ECR_PROFILE in environment variables");
    } else {
      ECRUserName = process.env.AWS_ECR_PROFILE;
    }
    const ECRUser = iam.User.fromUserName(this, "ecr-user", ECRUserName);

    const authorizationsECR = new iam.PolicyStatement({
      actions: authorizationsActionsECR,
      resources: [principalECR.repositoryArn, baseECR.repositoryArn]
    });

    new iam.Policy(this, "policy-ecr", {
      users: [ECRUser],
      policyName: "Policy-ECR",
      statements: [authorizationsECR]
    });

  }
}

export class ClusterStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, id="eks-vpc", { vpcName: "Starkbot-cluster-vpc" });
    
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

    const adminUser = iam.User.fromUserName(this, 'admin-user', username);

    cluster.awsAuth.addUserMapping(adminUser, { groups: [ 'system:masters' ]});

    const nodegroup = cluster.addNodegroupCapacity("nodegroup", {
      instanceTypes: [new ec2.InstanceType("t3.medium")],
      minSize: 1,
      maxSize: 10,
    });

    AutoScaler.enableAutoscaling(this, cluster, nodegroup);

  }
}

const authorizationsActionsDynamo: string[] = [
  "dynamodb:BatchGetItem",
  "dynamodb:ConditionCheckItem",
  "dynamodb:DescribeTable",
  "dynamodb:GetItem",
  "dynamodb:ListTagsOfResources",
  "dynamodb:PartiQLSelect",
  "dynamodb:Query",
  "dynamodb:Scan",
  "dynamodb:TagResource",
  "dynamodb:UntagResource",
  "dynamodb:BatchWriteItem",
  "dynamodb:CreateTable",
  "dynamodb:DeleteItem",
  "dynamodb:DeleteTable",
  "dynamodb:PartiQLDelete",
  "dynamodb:PartiQLInsert",
  "dynamodb:PartiQLUpdate",
  "dynamodb:PutItem",
  "dynamodb:UpdateItem",
  "dynamodb:UpdateTable",
];

const authorizationsActionsECR: string[] = [
  "ecr:DescribeImages",
  "ecr:ListImages",
  "ecr:BatchGetImage",
  "ecr:DescribeRegistry",
  "ecr:DescribeRepositories",
  "ecr:GetAuthorizationToken",
  "ecr:ListTagsForResource",
  "ecr:TagResource",
  "ecr:UntagResource",
  "ecr:PutImage",
  "ecr:ReplicateImage",
];