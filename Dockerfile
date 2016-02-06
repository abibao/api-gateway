FROM mhart/alpine-node:5.5

MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
ADD src /usr/src/app

RUN apk add --update make gcc g++ python && \
  npm install --production && \
  npm uninstall -g npm && \
  apk del make gcc g++ python && \
  rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

EXPOSE 80
CMD [ "node", "." ]