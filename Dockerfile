FROM mhart/alpine-node:6.2.2

MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY newrelic.js /usr/app/
COPY package.json /usr/app/
ADD src /usr/app
COPY robot.txt /usr/app/
COPY robot.txt /usr/app/www

RUN apk add --update make gcc g++ python && \
    npm install --production && \
    npm uninstall -g npm && \
    apk del make gcc g++ python && \
    rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

EXPOSE 80
CMD node .
