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
    server.logger.info('--------------------------------------------------------------');
    server.logger.info('GATEWAY BOOTSTRAP');
    server.logger.info('--------------------------------------------------------------');
    _.forEach(server.plugins.blipp.text().split('\n'), function(item) {
      if (item!=='') server.logger.info(item.trim());
    });
    server.logger.info('--------------------------------------------------------------');
    // start listeners
    domain.EntitiesListenerChanged();
    domain.SurveysListenerChanged();
    // start sockets
    Services.start_io();
    // finals injections
    domain.io = io;
    server.domain = domain;
  });
});