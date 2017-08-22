FROM node:8-alpine
MAINTAINER ukatama dev.ukatama@gmail.com


RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm i -g yarn

RUN apk add --no-cache --update make gcc g++ python libexecinfo-dev

RUN yarn install
RUN yarn add sqlite3 mysql mysql2 mariasql

RUN apk del make gcc g++ python libexecinfo-dev

COPY . /usr/src/app
ENV DISABLE_NOTIFIER true
RUN npm run production

EXPOSE 80
CMD ["npm", "start"]
