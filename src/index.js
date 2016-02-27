"use strict";

var nconf = require("nconf");
nconf.argv().env();

if (nconf.get("ABIBAO_API_GATEWAY_PRODUCTION_ENABLE")) {
  // production
  require("newrelic");
} else {
  // development
  require("dotenv").config({silent:false});
}
// declare services
var Services = require("./services");

// manage instances
var server = Services.server();
var domain = Services.domain();
var io = Services.io();

Services.startDomain(function(err) {
  if (err) return server.logger.fatal(err);
  Services.startServer(function(err) {
    if (err) return server.logger.fatal(err);
    // start listeners
    domain.administratorsListenerChanged();
    domain.entitiesListenerChanged();
    // start sockets
    Services.startIO(domain);
    // finals injections
    server.domain = domain;
    io.domain = domain;
  });
});