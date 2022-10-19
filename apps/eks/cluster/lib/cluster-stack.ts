import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';

export class EksSampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, id="VPC", { isDefault: true });

    const iam_role = new iam.Role(this, id="master-role", {
      roleName: "master-role",
      assumedBy: new iam.AccountPrincipal(this.account),
    });

    console.log(this.account);

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

    const cluster = new eks.Cluster(this, id='starkbot-cluster', {
      clusterName: "starkbot-cluster",
      vpc: vpc,
      vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
      mastersRole: iam_role,
      defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      version: eks.KubernetesVersion.V1_21,
    });

  }
}
