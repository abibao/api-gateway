FROM node:4.2.4

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