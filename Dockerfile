# Pull base image from stock node image.
FROM node:4.2.4

# Maintainer
MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

# Ignore APT warnings about not having a TTY
ENV DEBIAN_FRONTEND noninteractive

# Update hack for install bower with docker
RUN echo '{ "allow_root": true }' > /root/.bowerrc

# Install global npm
RUN npm update -g npm
RUN npm install -g bower

# Add the current working folder as a mapped folder at /app
# COPY ./newrelic.js /app/newrelic.js
COPY ./cloud9.json /app/cloud9.json
COPY ./package.json /app/package.json
COPY ./src /app

# Set the current working directory to the new mapped folder.
WORKDIR /app

# Install application's dependencies
RUN npm install --production

# Set the current working directory to the new mapped folder.
WORKDIR /app
 
# Expose port
EXPOSE 80

# Running
CMD node .