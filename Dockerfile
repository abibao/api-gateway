# Pull base image from stock node image.
FROM node:4.2.4

# Maintainer
MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

# Ignore APT warnings about not having a TTY
ENV DEBIAN_FRONTEND noninteractive

# RUN mkdir -p /src && cp -a /tmp/node_modules /src

# Update hack for install bower with docker
RUN echo '{ "allow_root": true }' > /root/.bowerrc

# Install global npm
RUN ["npm", "update", "-g", "npm"]
RUN ["npm", "install", "-g", "bower", "node-gyp"]

ADD package.json /tmp/package.json
RUN cd /tmp && npm install

# Expose port
EXPOSE 80

# Running
CMD ["npm", "--version"]