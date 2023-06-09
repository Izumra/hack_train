# syntax=docker/dockerfile:1

FROM node:18-alpine

WORKDIR /hack_train

ENV NODE_ENV=production

COPY ["package.json","./"]

RUN npm i --production

COPY . .

CMD ["npm","run","start"]