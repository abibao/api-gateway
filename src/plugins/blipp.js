"use strict";

var Blipp = require('blipp');

var BlippProvision = function(server, seneca) {
  server.register(Blipp, function(err) {
    
    if (err) return seneca.log.error('blipp provision', err);
    seneca.log.info('blipp', 'registered provision');
    
  });
};

module.exports = BlippProvision;