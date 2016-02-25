"use strict";

if (process.env.ABIBAO_API_GATEWAY_PRODUCTION_ENABLE) {
  // production
  require('newrelic');
} else {
  // development
  require('dotenv').config({silent:false});
}
// declare services
var Services = require('./services');

// manage instances
var server = Services.server();
var domain = Services.domain();
var io = Services.io();

// start the domain
Services.start_domain(function(err) {
  if (err) return server.logger.fatal(err);
  // start the server
  Services.start_server(function(err) {
    if (err) return server.logger.fatal(err);
    // start listeners
    // domain.EntitiesListener();
    // start sockets
    Services.start_io(domain);
    // finals injections
    server.domain = domain;
    io.domain = domain;
  });
});