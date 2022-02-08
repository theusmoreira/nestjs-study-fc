FROM node:14-alpine

RUN npm install -g @nestjs/cli

USER node

WORKDIR /home/node/app

