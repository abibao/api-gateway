FROM node:4.2.4
MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

# ignore APT warnings about not having a TTY
ENV DEBIAN_FRONTEND noninteractive

# install ubuntu dependencies
RUN apt-get update

# update hack for install bower with docker
RUN echo '{ "allow_root": true }' > /root/.bowerrc

# install global npm dependencies
RUN npm update -g npm
RUN npm install -g bower node-gyp

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

# from here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /opt/app
ADD . /opt/app

EXPOSE 80
CMD ["npm", "start"]