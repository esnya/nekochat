FROM node:onbuild
MAINTAINER ukatama dev.ukatama@gmail.com

RUN npm run build
EXPOSE 80
