"use strict";

if (process.env.ABIBAO_NEWRELIC_ENABLE) require('newrelic');

var service = require('./service');
service.start(function(err) {
  if (err) return service.seneca.log.error(err);
  service.seneca.log.info('server started ', service.server.info.uri);
});