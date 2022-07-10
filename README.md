# starkbot

Assign discord roles based on owned NFTs ✨


Check out the [demo video](https://youtu.be/t6fzjxRs_TA):

<a href="https://youtu.be/t6fzjxRs_TA" target="_blank">
 <img src="http://img.youtube.com/vi/t6fzjxRs_TA/hqdefault.jpg" alt="Watch the starkbot demo video" width="375" height="240" border="10" />
</a>

If you want to try it out live, follow those steps:
1. [Create a Starknet ID](https://starknet.id/) and verify your discord user id.
2. [Mint a BRIQ NFT](https://briq.construction) with the same wallet
3. [Go to the Focus Tree's discord](https://discord.gg/GSaSNyZs). You should get assigned the `🧱 Briq` role.
4. You can try to add you own rules by typing `/starkbot-add-rule` in #general

## Bot Setup

### Using our infra

1. [Invite starkbot](https://discord.com/api/oauth2/authorize?client_id=993439991822815292&permissions=0&scope=bot%20applications.commands) to your Discord server
2. Assign it a role and put this role at the top of your role list (so it can manage the below roles)
3. Create your first rule

```
/starkbot-add-rule
```

### On-premise

You can run the already prepared docker image:
```
docker run --env-file .env ghcr.io/gabsn/starkbot-discord-bot:v1
```
You need to create a `.env` file with your own discord and firebase credentials:
```
ENV=prod
DISCORD_CLIENT_SECRET=
DISCORD_CLIENT_ID=
DISCORD_BOT_TOKEN=
FIREBASE_CONFIG={...}
```
## Roadmap

### Features

- [x] Create / Delete / List rules
- [x] Automatically assign roles based on having or not an NFT
- [ ] Specify `min` and `max` balance value in rules to make the difference between whales and small holders.
- [ ] Support rules on NFT attributes to create different roles inside the same NFT collection
- [ ] Support templating engine to create dynamic roles (ex: `LVL: <player_level>`)

### Infra

- [ ] Make sure Firebase rules are properly setup as well as discord listeners to make sure only admins can add / delete rules
- [ ] Add monitoring to get alerted when the bot crashes
- [ ] Breakdown the different async functions in independent services to increase the scalability
- [ ] Create a Github workflow to automatically deploy the `starkbot` in production

## Contribution guide

### Dev Setup

1. Install [docker](https://docs.docker.com/get-docker/) (check out [colima](https://github.com/abiosoft/colima) if you're on Mac)
2. Install [pnpm](https://pnpm.io/installation#using-npm)
3. Install dependencies with `pnpm install`
4. Use node 18 with `nvm install 18 && nvm use default 18`
5. Setup firebase:

```
pnpm firebase login
```

### Getting Started

- Run all apps in dev mode

```
pnpm dev
```

- Start a specific app

```
pnpm nx start discord-bot
```
