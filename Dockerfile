FROM mhart/alpine-node:4

MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY src/. /usr/src/app

EXPOSE 80

CMD [ "npm", "start" ]