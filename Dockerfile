FROM mhart/alpine-node:5.5

MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

RUN mkdir -p /usr/src/app && \
  rm -rf /usr/src/app/node_modules
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY README.md /usr/src/app/
ADD src /usr/src/app

# If you have native dependencies, you'll need extra tools
RUN apk add --update make gcc g++ python

# If you need npm, don't use a base tag
RUN npm install --production

# If you had native dependencies you can now remove build tools
RUN apk del make gcc g++ python && \
  rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

EXPOSE 80
CMD [ "npm", "start" ]