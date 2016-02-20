"use strict";

var Promise = require("bluebird");
var JWT = require('jsonwebtoken');

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'AdministratorCreateAuthTokenCommand';

module.exports = function(urn) {
  
  var self = this;
  var time_start = new Date();
  var time_end;
  
  return new Promise(function(resolve, reject) {
    try {
      self.AdministratorReadQuery(urn).then(function(administrator) {
        var credentials = {
          action: self.ABIBAO_CONST_TOKEN_AUTH_ME,
          urn: administrator.urn, 
          scope: administrator.scope
        };
        var token = JWT.sign(credentials, process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY, { expiresIn: 60*60*24 });
        time_end = new Date();
        self.logger.debug(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
        resolve(token);
      })
      .catch(function(error) {
        time_end = new Date();
        self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
        reject(error);
      });
    } catch (e) {
      time_end = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
      reject(e);
    }
  });

};