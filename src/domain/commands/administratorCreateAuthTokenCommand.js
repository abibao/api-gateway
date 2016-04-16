"use strict";

var Promise = require("bluebird");
var JWT = require("jsonwebtoken");

var nconf = require("nconf");
nconf.argv().env().file({ file: 'nconf-env.json' });

module.exports = function(urn) {
  var self = this;
  return new Promise(function(resolve, reject) {
    try {
      self.execute('query', 'administratorReadQuery', urn).then(function(administrator) {
        var credentials = {
          action: self.ABIBAO_CONST_TOKEN_AUTH_ME,
          urn: administrator.urn, 
          scope: administrator.scope
        };
        var token = JWT.sign(credentials, nconf.get("ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY"), { expiresIn: 60*60*24 });
        resolve(token);
      })
      .catch(function(error) {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });
  
};