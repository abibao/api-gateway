FROM node:4.2.6
MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ONBUILD COPY package.json /usr/src/app/
ONBUILD RUN npm install
ONBUILD COPY . /usr/src/app

EXPOSE 80
CMD [ "npm", "start" ]