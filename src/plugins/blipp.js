"use strict";

var Blipp = require('blipp');

var BlippProvision = function(server, callback) {
  server.register(Blipp, function(err) {
    
    if (err) return server.logger.fatal('blipp provision', err);
    server.logger.info('blipp registered provision');
    
    callback();
    
  });
};

module.exports = BlippProvision;