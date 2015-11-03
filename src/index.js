"use strict";

if (process.env.ABIBAO_NEWRELIC_ENABLE) require('newrelic');

var server = require('./server');
server.start(function() {
  console.log('Server started ', server.info.uri);
});