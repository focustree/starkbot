# Welcome to the IAC part of Starkbot

# Follow these steps to deploy the infrastructure

1) Compile the code with "npm run build"

2) Provision initial resources to your Aws environment with "cdk bootstrap"
Here is all you need to know about bootstrapping : https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html

3) Deploy the infrastructure with "cdk deploy"




# Here is a CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
