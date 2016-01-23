# Pull base image from stock node image.
FROM node:4.2.4

# Maintainer
MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

# Ignore APT warnings about not having a TTY
ENV DEBIAN_FRONTEND noninteractive

# Install/Update apt-get
RUN apt-get update \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

# Update hack for install bower with docker
RUN echo '{ "allow_root": true }' > /root/.bowerrc

# Install global npm
RUN npm update -g npm
RUN npm install -g node-gyp
RUN npm install -g bower

# Add the current working folder as a mapped folder at /app
COPY ./src /app
WORKDIR /app
 
# Expose port
EXPOSE 80

# Running
CMD ["ls"]