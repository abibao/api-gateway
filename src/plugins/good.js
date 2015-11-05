"use strict";

var Good = require('good');

var options = {
  reporters: [{
    reporter: require('good-console'),
    events: { log: '*', response: '*' }
  }] 
};

var GoodProvision = function(server, seneca) {
  server.register({
    register: Good,
    options: options
  }, function (err) {
    
    if (err) return seneca.log.error('good provision', err);
    seneca.log.info('good provision', 'registered');
    
  });
};

module.exports = GoodProvision;