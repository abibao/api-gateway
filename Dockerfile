FROM ubuntu:trusty

MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

RUN sudo apt-get update
  && sudo apt-get install build-essential
  && sudo apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash - \
  && sudo apt-get install -y nodejs \
  && npm update -g npm \
  && npm install -g grunt-cli

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY src/. /usr/src/app
RUN ll

EXPOSE 80

CMD [ "npm", "start" ]