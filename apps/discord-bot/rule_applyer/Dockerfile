ARG ECR_REPO
FROM $ECR_REPO AS build
COPY . .
RUN pnpm nx build discord-bot

FROM node:18-slim
WORKDIR /rule_applyer

COPY --from=build /starkbot/dist/apps/discord-bot/rule_applyer /rule_applyer/dist/apps/discord-bot/rule_applyer
COPY --from=build /starkbot/node_modules /rule_applyer/node_modules
COPY --from=build /starkbot/aws-credentials ../.aws/credentials

CMD ["node", "dist/apps/discord-bot/rule_applyer/main.js"]
