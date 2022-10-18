import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class EksSampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /*const vpc = new ec2.Vpc(this, 'my-cdk-vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      subnetConfiguration: [
        {name: 'public', cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC},
      ],
    });*/

    /*const repository = new ecr.Repository(this, 'starkbot-ecr', {
      repositoryName: "starkbot-repository"
    });*/

    const cluster = new eks.Cluster(this, 'sample-eks', {
      version: eks.KubernetesVersion.V1_21,
    });

  }
}
