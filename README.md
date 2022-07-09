# starkbot

Assign discord roles based on owned NFTs ✨

## Bot Usage

Check out the demo video to understand how to use `starkbot`:

<a href="http://www.youtube.com/watch?feature=player_embedded&v=nTQUwghvy5Q" target="_blank">
 <img src="http://img.youtube.com/vi/nTQUwghvy5Q/mqdefault.jpg" alt="Watch the video" width="480" height="360" border="10" />
</a>

## Bot Setup

1. Invite `starkbot` to your Discord server
2. Assign it a role and put this role at the top of your role list (so it can manage the below roles)
3. Create your first rule
```
starkbot-add-rule
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
