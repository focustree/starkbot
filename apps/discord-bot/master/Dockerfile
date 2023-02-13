ARG ECR_REPO
FROM $ECR_REPO AS build
COPY . .
RUN pnpm nx build discord-bot

FROM node:18-slim
WORKDIR /master

COPY --from=build /starkbot/dist/apps/discord-bot/master /master/dist/apps/discord-bot/master
COPY --from=build /starkbot/node_modules /master/node_modules
COPY --from=build /starkbot/aws-credentials ../.aws/credentials

CMD ["node", "dist/apps/discord-bot/master/main.js"]
