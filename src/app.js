"use strict";

var _ = require('lodash');

// enable cloud9 configuration file.
if (process.env.ABIBAO_API_GATEWAY_CLOUD9_ENABLE) {
  var _ = require('lodash');
  var jsonfile = require('jsonfile');
  _.merge(process.env, jsonfile.readFileSync('cloud9.json'));
}

if (process.env.ABIBAO_API_GATEWAY_NEWRELIC_ENABLE) require('newrelic');

// declare all services
var Services = require('./services');
// get instances
var server = Services.server();
var domain = Services.domain();
var io = Services.io();

// start the server
Services.start_server(function(err) {
  if (err) return server.logger.fatal(err);
  Services.start_io();
  server.logger.info('server started ', server.info.uri);
  server.logger.info('--------------------------------------------------------------');
  server.logger.info('BLIPP RESULTS');
  server.logger.info('--------------------------------------------------------------');
  _.forEach(server.plugins.blipp.text().split('\n'), function(item) {
    if (item!=='') server.logger.info(item.trim());
  });
  server.logger.info('--------------------------------------------------------------');
  // initialize the domain
  domain.logger = server.logger;
  domain.logger_slack = server.logger_slack;
  domain.io = io;
  // domain.rethinkdb = server.plugins['hapi-rethinkdb'].connection;
  // start domain listeners
  domain.IndividualsListenerChanged();
  // affect domain to server
  server.domain = domain;
});