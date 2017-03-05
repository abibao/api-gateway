FROM mhart/alpine-node:6

MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY process.yml /usr/app/process.yml
COPY newrelic.js /usr/app/newrelic.js
COPY package.json /usr/app/package.json
COPY src /usr/app
COPY config /usr/config
COPY robot.txt /usr/app/robot.txt
COPY robot.txt /usr/app/www/robot.txt

RUN npm install pm2 -g && \
    pm2 install pm2-slack && \
    pm2 set pm2-slack:slack_url https://hooks.slack.com/services/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 && \
    pm2 set pm2-slack:online true && \
    pm2 set pm2-slack:stop true && \
    pm2 set pm2-slack:start true && \
    pm2 set pm2-slack:restart true

RUN apk add --update make gcc g++ python && \
    npm install --production && \
    npm uninstall -g npm && \
    apk del make gcc g++ python && \
    rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

EXPOSE 80
CMD ["pm2", "start", "process.yml", "--only", "api.rece.abibao.com"]
