"use strict";

var Blipp = require('blipp');

var BlippProvision = function(server, callback) {
  server.register(Blipp, function(err) {
    
    if (err) return console.log('blipp provision', err);
    console.log('blipp', 'registered provision');
    
    callback();
    
  });
};

module.exports = BlippProvision;