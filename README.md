# Starkbot

Assign discord roles based on owned NFTs ✨

Check out the [demo video](https://youtu.be/t6fzjxRs_TA):

<a href="https://youtu.be/t6fzjxRs_TA" target="_blank">
 <img src="http://img.youtube.com/vi/t6fzjxRs_TA/hqdefault.jpg" alt="Watch the starkbot demo video" width="375" height="240" border="10" />
</a>

## Bot Setup

### Using our infra

If you want to try it out on your server, follow those steps:

1. [Create a Starknet ID](https://starknet.id/) and verify your discord user id.
2. [Mint a BRIQ NFT](https://briq.construction) with the same wallet
3. [Invite starkbot](https://discord.com/api/oauth2/authorize?client_id=993439991822815292&permissions=268435456&scope=bot%20applications.commands) on your Discord server
4. Assign it a role and put this role at the top of your role list (so it can manage the below roles).  
Give it a role that has the enough permissions!
5. Create your own rules by typing `/starkbot-add-rule` in #general

```
/starkbot-add-rule
```

### Deploy it yourself

#### Fill your environment variables

You need to create a `.env` file with your informations and credentials:

```
ENV=dev

DISCORD_CLIENT_ID_DEV=
DISCORD_BOT_TOKEN_DEV=

STARKNET_ID_CONTRACT_ADDRESS=0x0798e884450c19e072d6620fefdbeb7387d0453d3fd51d95f5ace1f17633d88b
STARKNET_ID_INDEXER_URL=https://goerli.indexer.starknet.id/field_data_to_id
VERIFIER_DECIMAL_CONTRACT_ADDRESS=2858829565965467824506234522366406559425492229537050207406969294731822669741
DISCORD_TYPE=28263441981469284

AWS_PROFILE=
AWS_NAME=
AWS_LINK=
AWS_ECR=
AWS_DB_PROFILE=
AWS_REGION=

DYNAMODB_TABLE_GUILD_DEV=
DYNAMODB_TABLE_STARKNET_ID_DEV=

JWT_KEY=
RST_KEY=
API_URL="http://localhost:3000/api"
```

- Fill the 2 missing DISCORD variables with your bot application credentials (create one on [discord dev portal](https://discord.com/developers) )
- Fill `AWS_PROFILE` with the aws profile you want to use
- Fill `AWS_NAME` with the name of the iam user you are using
- Fill `AWS_DB_PROFILE` with the aws profile you want to use to run the app and reach the db. We recommand using a IAM user with minimum privileges for security reasons
- Fill `AWS_REGION` with the aws region you want to use 
- Fill the 2 missing token key with generated tokens (only for running website, see website section below)
- For using Github Actions Workflow : change ECR names in cd.yaml and add your credentials in github secrets. We recommand using a IAM user with minimum privileges for security reasons

#### Run the bot locally

- Deploy the infra with `pnpm infra:deploy`
- Grab your ECR repositories name and fill it in package.json and in environment variables
- Fill the 2 missing DynamoDB variable with your tables name and config
- Run `pnpm dev` to launch the bot locally

#### Deploy the bot on your EKS cluster

- Deploy base image with `pnpm docker:deploy:base`
- Create an `aws-credentials` file in root and fill it with your `AWS_DB_PROFILE` credentials. This file is put into the docker image during building
- Deploy app in EKS cluster with `pnpm kube:deploy`

## Roadmap

### Features

- [x] Create / Delete / List rules
- [x] Automatically assign roles based on having or not an NFT
- [x] Specify `min` and `max` balance value in rules to make the difference between whales and small holders.
- [ ] Allow creating more sophisticated roles based on multiple NFTs.
- [ ] Support rules on NFT attributes to create different roles inside the same NFT collection
- [ ] Support templating engine to create dynamic roles (ex: `LVL: <player_level>`)

### Infra

- [x] Make sure only admins can add / delete rules
- [x] Create a Github workflow to automatically deploy the `starkbot` in production
- [x] Move DBMS from Firebase to DynamoDB
- [x] Create an EKS cluster and deploy Starkbot into it to increase scalability
- [ ] Rework parallelism
- [ ] Monitor I/O of users to record only server changes
- [ ] Add monitoring to get alerted when the bot crashes
- [ ] Breakdown the different async functions in independent services and use Kubernetes queues to increase the scalability


## Starkbot website

You need to create two different secrets stored in environment variables for the website : `JWT_KEY` and `RST_KEY`. You have to include them in the global *.env* file

You can use the following command to generate random secrets:
```
openssl rand -hex 32 
```

Run the website from the root with 
```
pnpm web:launch
```

You can then reach the website at `http://localhost:3000`

## Contribution guide

### Dev Setup

1. Install [docker](https://docs.docker.com/get-docker/) (check out [colima](https://github.com/abiosoft/colima) if you're on Mac)
2. Install [pnpm](https://pnpm.io/installation#using-npm)
3. Install dependencies with `pnpm install`
4. Use node 18 with `nvm install 18 && nvm use default 18`
5. Setup your environment variables as mentionned above

If you are an Onlydust contributor, don't deploy the infra on your personnal account. Simply ask the project lead to generate you some access tokens.


### Getting Started

- Run bot app in dev mode :

```
pnpm dev
```

- Start a specific app

```
pnpm nx start website
```