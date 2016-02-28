"use strict";

var Blipp = require("blipp");

var options = {
  showAuth: false,
  showStart: false
};

var BlippProvision = function(server, callback) {
  server.register({
    register: Blipp,
    options
  }, function (err) {
    if (err) { return callback(err); }
    callback();
  });
};

module.exports = BlippProvision;