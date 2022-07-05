# starkbot

Assign discord roles based on owned NFTs ✨

## Setup

1. Install [docker](https://docs.docker.com/get-docker/) (check out [colima](https://github.com/abiosoft/colima) if you're on Mac)
2. Install [pnpm](https://pnpm.io/installation#using-npm)
3. Install dependencies with `pnpm install`
4. Use node 18 with `nvm install 18 && nvm use default 18`
5. Setup firebase:

```
pnpm firebase login
```

## Getting Started

### Run all apps in dev mode

```
pnpm dev
```

### Start a specific app

```
pnpm nx start discord-bot
```
