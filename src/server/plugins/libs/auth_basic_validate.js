"use strict";

var nconf = require("nconf");
nconf.argv().env().file({ file: 'nconf-env.json' });

module.exports = function validate (request, username, password, callback) {
  
  var user = nconf.get("ABIBAO_API_GATEWAY_SERVER_AUTH_BASIC_USERNAME");
  if (!username) {
    return callback(null, false);
  }
  if (username!==user) {
    return callback(null, false);
  }
  
  var isValid = (password===nconf.get("ABIBAO_API_GATEWAY_SERVER_AUTH_BASIC_PASSWORD"));
  callback(null, isValid, {id: 1, name: username});
  
};