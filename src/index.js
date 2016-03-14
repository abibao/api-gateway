"use strict";

var debug = require("debug")("abibao:initializers");
debug("start");

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
  if (err) { return debug(err); }
  Services.startServer(function(err) {
    if (err) { return debug(err); }
    // start listeners
    domain.administratorsListenerChanged();
    domain.campaignsItemsListenerChanged();
    domain.campaignsItemsChoicesListenerChanged();
    domain.campaignsListenerChanged();
    domain.entitiesListenerChanged();
    domain.individualsListenerChanged();
    domain.surveysListenerChanged();
    // start sockets
    Services.startIO(domain);
    // finals injections
    server.domain = domain;
    io.domain = domain;
    debug("end");
  });
});