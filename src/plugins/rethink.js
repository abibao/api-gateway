"use strict";

var Rethink = require('hapi-rethinkdb');

var options = {
  host: process.env.ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST,
  port: process.env.ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT,
  db: process.env.ABIBAO_API_GATEWAY_SERVER_RETHINK_DB,
  authKey: process.env.ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY
};

var RethinkProvision = function(server, callback) {
  server.register({
    register: Rethink,
    options: options
  }, function (err) {
    
    if (err) return server.logger.fatal('rethink provision', err);
    server.logger.info('rethink registered provision');
    
    callback();
    
  });
};

module.exports = RethinkProvision;