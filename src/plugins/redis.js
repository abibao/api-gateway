"use strict";

var Redis = require('hapi-redis');

var options = {
  connection: {
    host: '94.23.215.61',
    port: 6379,
    password: 'redis#abibao#2015'
  }
};

var RedisProvision = function(server, callback) {
  server.register({
    register: Redis,
    options: options
  }, function (err) {
    
    if (err) return server.logger.fatal('redis provision', err);
    server.logger.info('redis registered provision');
    
    callback();
    
  });
};

module.exports = RedisProvision;