"use strict";

if (process.env.ABIBAO_NEWRELIC_ENABLE) require('newrelic');

var service = require('./service');
service.start(function(err) {
  if (err) return service.server.logger.error(err);
  service.server.logger.info('server started ', service.server.info.uri);
});