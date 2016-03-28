"use strict";

var Good = require("good");

var GoodProvision = function(server, callback) {
  var options = {
    opsInterval: 1000,
    reporters: [{
      reporter: require("good-bunyan"),
      config: {
        logger: server.logger,
        levels: {
          ops: "debug",
          response: "info"
        },
        /*formatters: {
          response(data) {
            return data.method+" "+data.path+" "+data.statusCode+" ("+data.responseTime+"ms)";
          }
        }*/
      },
      events: { log: "*", response: "*" }
    }] 
  };
  server.register({
    register: Good,
    options
  }, function (err) {
    if (err) { return callback(err); }
    callback();
  });
};

module.exports = GoodProvision;