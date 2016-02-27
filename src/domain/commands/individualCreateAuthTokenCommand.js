"use strict";

var Promise = require("bluebird");
var JWT = require("jsonwebtoken");

var CURRENT_ACTION = "Command";
var CURRENT_NAME = "IndividualCreateAuthTokenCommand";

module.exports = function(urn) {
  
  var self = this;
  var timeStart = new Date();
  var timeEnd;
  
  return new Promise(function(resolve, reject) {
    try {
      self.individualReadQuery(urn).then(function(individual) {
        var credentials = {
          action: self.ABIBAO_CONST_TOKEN_AUTH_ME,
          urn: individual.urn, 
          scope: individual.scope
        };
        var token = JWT.sign(credentials, process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY, { expiresIn: 60*60*24 });
        timeEnd = new Date();
        self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
        resolve(token);
      })
      .catch(function(error) {
        timeEnd = new Date();
          self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
          reject(error);
      });
    } catch (e) {
      timeEnd = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
      reject(e);
    }
  });

};