# Pull base image from stock node image.
FROM node:4.2.4

# Maintainer
MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

# Ignore APT warnings about not having a TTY
ENV DEBIAN_FRONTEND noninteractive

# Install apt-get
RUN apt-get update && apt-get install -y \
    graphicsmagick \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

# Update hack for install bower with docker
RUN echo '{ "allow_root": true }' > /root/.bowerrc

# Install global npm
RUN npm update -g npm
RUN npm install -g node-gyp
RUN npm install -g bower

# Download and install node_modules
# /tmp to avoid docker caching problems
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

# Bundle app source
COPY ./src /usr/src/app
WORKDIR /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]