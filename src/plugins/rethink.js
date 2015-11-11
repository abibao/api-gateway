"use strict";

var Rethink = require('hapi-rethinkdb');

var options = {
  host: 'store.abibao.com',
  port: 28015,
  db: 'test',
  authKey: '8UR40M2nQ8leURX262xY0OokvfhQunG4'
};

var RethinkProvision = function(server, callback) {
  server.register({
    register: Rethink,
    options: options
  }, function (err) {
    
    if (err) return console.log('rethink provision', err);
    console.log('rethink provision', 'registered');
    
    callback();
    
  });
};

module.exports = RethinkProvision;