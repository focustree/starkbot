FROM node:18-slim
RUN apt-get update && \
    apt-get install -y git
RUN npm i -g pnpm@7.5.0
WORKDIR /starkbot
COPY pnpm-lock.yaml .
RUN pnpm fetch
COPY package.json .
RUN pnpm install --offline