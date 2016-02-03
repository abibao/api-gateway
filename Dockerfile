# Pull base image from stock node image.
FROM node:4.2.4

# Maintainer
MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

# Ignore APT warnings about not having a TTY
ENV DEBIAN_FRONTEND noninteractive

# Update hack for install bower with docker
RUN echo '{ "allow_root": true }' > /root/.bowerrc

# Install global npm
RUN ["npm", "update", "-g", "npm"]
RUN ["npm", "install", "-g", "bower", "node-gyp"]

# Add the current working folder as a mapped folder at /app
COPY ./src /app
COPY ./package.json /app/package.json
WORKDIR /app
RUN ["npm", "npm", "--version"]
RUN ["npm", "bower", "--version"]
RUN ["npm", "install"]

# Expose port
EXPOSE 80

# Running
CMD ["npm", "start"]