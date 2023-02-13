ARG ECR_REPO
FROM $ECR_REPO AS build
COPY . .
RUN pnpm nx build discord-bot

FROM node:18-slim
WORKDIR /member_fetcher

COPY --from=build /starkbot/dist/apps/discord-bot/member_fetcher /member_fetcher/dist/apps/discord-bot/member_fetcher
COPY --from=build /starkbot/node_modules /member_fetcher/node_modules
COPY --from=build /starkbot/aws-credentials ../.aws/credentials

CMD ["node", "dist/apps/discord-bot/member_fetcher/main.js"]
