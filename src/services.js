"use strict";

var Hapi = require("hapi");
var Routes = require("./server/routes");

// var fs = require("fs");
var _ = require("lodash");
var async = require("async");
var bunyan = require("bunyan");
// var bunyanLumberjackStream = require("bunyan-lumberjack");

// logger :: Console
var loggerConsole = bunyan.createLogger({
  name: "api-gateway",
  level: "debug"
});

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
var io = require("socket.io")(server.listener);
var domain = require("./domain");

var Boom = require("boom");

module.exports.startIO = function(domain) {
  io.on("connection", function(socket) {
    
    // SocketConnectedEvent
    domain.logger.info("Socket connected with id="+socket.id);
    
    // AdministratorLoginWithCredentialsCommand
    socket.on("urn:socket:get:/v1/administrators/login", function(payload) {
      domain.logger.info("socket get /v1/administrators/login", socket.id);
      domain.administratorLoginWithCredentialsCommand(payload).then(function(credentials) {
        socket.emit("response:socket:get:/v1/administrators/login", credentials);
      })
      .catch(function(error) {
        socket.emit("response:socket:get:/v1/administrators/login", Boom.badRequest(error).output.payload);
      });
    });
    
    // SystemFindDataQuery >> EntityModel
    socket.on("urn:socket:get:/v1/entities", function() {
      domain.logger.info("socket get /v1/entities", socket.id);
      domain.systemFindDataQuery(domain.EntityModel, {}).then(function(entities) {
        socket.emit("response:socket:get:/v1/entities", entities);
      })
      .catch(function(error) {
        socket.emit("response:socket:get:/v1/entities", Boom.badRequest(error).output.payload);
      });
    });
    
  });
};

module.exports.startDomain = function(callback) {
  domain.logger = loggerConsole;
  domain.debug = {
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
  server.logger = loggerConsole;
  var debug = require("debug")("abibao:server:initializer");
  var plugins = ["good", "auth", "swagger", "blipp"];
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
      if (err) {
        return callback(err);
      }
      var debug = require("debug")("abibao:gateway:initializer");
      _.forEach(server.plugins.blipp.text().split("\n"), function(item) {
        if (item!=="") {
          debug(item.trim());
        }
      });
      callback();
    });
  });
};

module.exports.io = function() {
  return io;
};

module.exports.server = function() {
  return server;
};

module.exports.domain = function() {
  return domain;
};

/*var outStream = bunyanLumberjackStream({
  tlsOptions: {
    host: "94.23.215.61",
    port: 5000,
    ca: [fs.readFileSync("/etc/logstash/ssl/lumberjack.crt", {encoding: "utf-8"})]
  }
});

outStream.on("connect", function() {
    console.log("CONNECTED!");
});
outStream.on("dropped", function(count) {
    console.log("ERROR: Dropped " + count + " messages!");
});
outStream.on("disconnect", function(err) {
    console.log("WARN : Disconnected", err);
});

var loggerConsole = bunyan.createLogger({
    name: "abibao-api-gateway",
    streams: [{level: "info", type: "raw", stream: outStream}]
});*/

// logger to console (production mode)
/* var logger_file = bunyan.createLogger({
  name: "api-gateway",
  level: "debug",
  streams: [{
    type: "rotating-file",
    path: nconf.get("ABIBAO_API_GATEWAY_LOGS_FILE"),
    period: "1d",   // daily rotation
    count: 3        // keep 3 back copies
  }]
}); */