ARG ECR_REPO
FROM $ECR_REPO AS build
COPY . .
RUN pnpm nx build discord-bot 

FROM node:18-slim
WORKDIR /dynamodb

COPY --from=build /starkbot/dist/apps/discord-bot/dynamodb /dynamodb/dist/apps/discord-bot/dynamodb
COPY --from=build /starkbot/node_modules /dynamodb/node_modules
COPY --from=build /starkbot/aws-credentials ../.aws/credentials

CMD ["node", "dist/apps/discord-bot/dynamodb/main.js"]
