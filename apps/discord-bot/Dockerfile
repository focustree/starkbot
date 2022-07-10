FROM ghcr.io/gabsn/starkbot-base AS build
COPY . .
RUN pnpm nx build discord-bot

FROM node:18-slim
WORKDIR /discord-bot

COPY --from=build /starkbot/dist/apps/discord-bot /discord-bot/dist/apps/discord-bot
COPY --from=build /starkbot/node_modules /discord-bot/node_modules

CMD ["node", "dist/apps/discord-bot/main.js"]
