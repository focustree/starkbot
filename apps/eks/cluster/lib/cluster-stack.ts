import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import { AutoScaler } from './auto-scaler';

export class EksSampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, id="eks-vpc");

    /*const iam_role = new iam.Role(this, id="master-role", {
      roleName: "master-role",
      assumedBy: new iam.AccountPrincipal(this.account),
    });*/

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

    const nodegroup = cluster.addNodegroupCapacity("nodegroup", {
      instanceTypes: [new ec2.InstanceType("t3.medium")],
      minSize: 1,
      maxSize: 10,
    });

    AutoScaler.enableAutoscaling(this, cluster, nodegroup);

  }
}
