FROM 071785475400.dkr.ecr.eu-west-3.amazonaws.com/starkbot-base-repository AS build
COPY . .
RUN pnpm nx build discord-bot

FROM node:18-slim
WORKDIR /discord-bot

COPY --from=build /starkbot/dist/apps/discord-bot /discord-bot/dist/apps/discord-bot
COPY --from=build /starkbot/node_modules /discord-bot/node_modules
COPY --from=build /starkbot/aws-credentials ../.aws/credentials

CMD ["node", "dist/apps/discord-bot/main.js"]
