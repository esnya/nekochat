FROM node:6
MAINTAINER ukatama dev.ukatama@gmail.com

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install
RUN npm install sqlite3 mysql mysql2 mariasql

COPY . /usr/src/app
ENV DISABLE_NOTIFIER true
RUN npm run production

EXPOSE 80
CMD ["npm", "start"]
