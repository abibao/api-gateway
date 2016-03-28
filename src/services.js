"use strict";

var Hapi = require("hapi");
var Routes = require("./server/routes");
var async = require("async");
var bunyan = require("bunyan");

function commandSerializer(command) {
  return {
    //remoteAddress: command.info.remoteAddress,
    //hostname: command.info.hostname,
    //referrer: command.info.referrer,
    name: command.name,
    uuid: command.uuid,
    exectime: command.exectime
  };
}

function querySerializer(query) {
  return {
    //remoteAddress: command.info.remoteAddress,
    //hostname: command.info.hostname,
    //referrer: command.info.referrer,
    name: query.name,
    uuid: query.uuid,
    exectime: query.exectime
  };
}

var logger = bunyan.createLogger({
  name: "api-gateway",
  level: "debug",
  serializers: bunyan.stdSerializers,
  streams: [{
    level: 'debug',
    stream: process.stdout
  }]
});

logger.addSerializers({command: commandSerializer});
logger.addSerializers({query: querySerializer});

/* var logger = bunyan.createLogger({
  name: "api-gateway",
  level: "debug",
  streams: [{
    level: 'debug',
    stream: process.stdout
  }, {
    level: 'info',
    type: "raw",
      stream: require('bunyan-logstash-tcp').createStream({
        host: "94.23.215.61",
        port: 5000
      })
  }]
}); */

var nconf = require("nconf");
nconf.argv().env();

var options = {
  host: nconf.get("ABIBAO_API_GATEWAY_EXPOSE_IP"),
  port: nconf.get("ABIBAO_API_GATEWAY_EXPOSE_PORT"),
  labels: ["api", "administrator"]
};

var server = new Hapi.Server({
  debug: false,
  connections: {
    routes: {
      cors: true
    }
  }
});

server.connection(options);

var domain = require("./domain");

module.exports.startDomain = function(callback) {
  domain.logger = logger;
  domain.debug = {
    listener: require("debug")("abibao:domain:listener"),
    event: require("debug")("abibao:domain:event"),
    command: require("debug")("abibao:domain:command"),
    query: require("debug")("abibao:domain:query")
  };
  var plugins = ["models", "queries/system", "commands/system", "events/system", "listeners/system", "queries", "commands", "events", "listeners"];
  async.mapSeries(plugins, function(item, next) {
    domain.injector(item, function(error, result) {
      next(error, result);
    });
  }, function(err) {
    callback(err);
  });
};

module.exports.startServer = function(callback) {
  server.logger = logger;
  var debug = require("debug")("abibao:server:initializer");
  var plugins = ["good", "auth", "swagger"];
  async.mapSeries(plugins, function(item, next) {
    require("./server/plugins/"+item)(server, function() {
      next(null, item);
    });
  }, function(err, results) {
    if (err) {
      return callback(err);
    }
    debug("[HapiPlugins]", results);
    server.route(Routes.endpoints);
    // start
    server.start(function(err) {
      if (err) { return callback(err); }
      callback();
    });
  });
};

module.exports.server = function() {
  return server;
};

module.exports.domain = function() {
  return domain;
};
