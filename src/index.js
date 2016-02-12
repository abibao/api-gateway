"use strict";

var _ = require('lodash');

// enable cloud9 configuration file.
if (process.env.ABIBAO_API_GATEWAY_CLOUD9_ENABLE) {
  var jsonfile = require('jsonfile');
  _.merge(process.env, jsonfile.readFileSync('cloud9.json'));
}

// enable newrelic
if (process.env.ABIBAO_API_GATEWAY_NEWRELIC_ENABLE) require('newrelic');

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
    domain.EntitiesListener();
    domain.IndividualsListener();
    domain.SurveysListener();
    // start sockets
    Services.start_io();
    // finals injections
    domain.io = io;
    server.domain = domain;
  });
});