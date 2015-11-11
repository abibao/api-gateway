"use strict";

var Good = require('good');

var options = {
  reporters: [{
    reporter: require('good-console'),
    events: { log: '*', response: '*' }
  }] 
};

var GoodProvision = function(server, callback) {
  server.register({
    register: Good,
    options: options
  }, function (err) {
    
    if (err) return console.log('good provision', err);
    console.log('good provision', 'registered');
    
    callback();
    
  });
};

module.exports = GoodProvision;