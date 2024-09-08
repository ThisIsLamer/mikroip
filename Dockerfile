FROM node:latest as base

RUN mkdir /root/app
WORKDIR /root/app

COPY package.json .
COPY package-lock.json .
RUN npm install -g npm
RUN npm ci

COPY ./src/ ./src/
COPY ./types/ ./types/
COPY .env .
COPY fastify.config.json .
COPY tsconfig.json .

RUN npm run build