"use strict";

var Promise = require("bluebird");
var JWT = require("jsonwebtoken");

var nconf = require("nconf");
nconf.argv().env().file({ file: 'nconf-env.json' });

module.exports = function(urn) {
  
  var CURRENT_NAME = "AdministratorCreateAuthTokenCommand";
  
  var self = this;
  var starttime = new Date();
  
  self.debug.command('%s %o', CURRENT_NAME, urn);
  
  return new Promise(function(resolve, reject) {
    try {
      self.administratorReadQuery(urn).then(function(administrator) {
        var credentials = {
          action: self.ABIBAO_CONST_TOKEN_AUTH_ME,
          urn: administrator.urn, 
          scope: administrator.scope
        };
        var token = JWT.sign(credentials, nconf.get("ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY"), { expiresIn: 60*60*24 });
        var request = {
          name: CURRENT_NAME,
          exectime: new Date() - starttime
        };
        self.logger.info({command:request}, '[command]');
        resolve(token);
      })
      .catch(function(error) {
        self.debug.error('%s %o', CURRENT_NAME, error);
        reject(error);
      });
    } catch (e) {
      self.debug.error('%s %o', CURRENT_NAME, e);
      reject(e);
    }
  });
  
};