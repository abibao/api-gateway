FROM ubuntu:trusty

MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

RUN sudo apt-get install curl libcurl3 libcurl3-dev \
  && curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash - \
  && sudo apt-get install -y nodejs \
  && sudo npm install -g grunt-cli

RUN npm update -g npm

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY src/. /usr/src/app

EXPOSE 80

CMD [ "npm", "start" ]