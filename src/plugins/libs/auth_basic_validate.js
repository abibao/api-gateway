"use strict";

module.exports = function validate (request, username, password, callback) {
  
  var user = process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_BASIC_USERNAME || 'USERNAME';
  if (!username) {
    return callback(null, false);
  }
  if (username!==user) {
    return callback(null, false);
  }
  
  var isValid = (password===process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_BASIC_PASSWORD || 'PASSWORD');
  callback(null, isValid, {id: 1, name: username});
  
};