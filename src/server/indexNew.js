"use strict";

var debug = require("debug")("abibao:server:initializer");

var Promise = require("bluebird");
var async = require("async");
var uuid = require("node-uuid");

var nconf = require("nconf");
nconf.argv().env();

var Hapi = require("hapi");
var Routes = require("./routes");

var internal = {};

internal.server = new Hapi.Server({
  debug: false,
  connections: {
    routes: {
      cors: true
    }
  }
});
var options = {
  host: nconf.get("ABIBAO_API_GATEWAY_EXPOSE_IP"),
  port: nconf.get("ABIBAO_API_GATEWAY_EXPOSE_PORT"),
  labels: ["api", "administrator"]
};
internal.server.connection(options);
/*const preResponse = function (request, reply) {
  var response = request.response;
  response.output.headers["x-abibao-response-id"] = uuid.v1();
  reply.continue();
};*/
//internal.server.ext("onPreResponse", preResponse);

internal.server.logger = {
  debug: require("debug")("abibao:server:debug"),
  error: require("debug")("abibao:server:error")
};
module.exports.singleton = internal.server;

module.exports.start = function() {
  return new Promise(function(resolve, reject) {
    var plugins = ["auth", "swagger", "blipp"];
    debug(plugins);
    async.mapSeries(plugins, function(item, next) {
      require("./plugins/"+item)(internal.server, function() {
        next(null, item);
      });
    }, function(err, results) {
      if (err) { return reject(err); }
      debug("define routes");
      internal.server.route(Routes.endpoints);
      resolve();
    });
  });
};

