# Pull base image from stock node image.
FROM node:4.2.4

# Maintainer
MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

# Ignore APT warnings about not having a TTY
ENV DEBIAN_FRONTEND noninteractive

# Install apt-get
RUN apt-get update \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

# Install global npm
RUN npm update -g npm
RUN npm install -g node-gyp

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY ./src /usr/src/app
 
# Expose port
EXPOSE 80

# Running
CMD [ "npm", "start" ]