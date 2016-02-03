"use strict";

var JWT = require('jsonwebtoken');

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'AdministratorCreateAuthTokenCommand';

module.exports = function(data, callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');

    self.SystemReadDataQuery(self.AdministratorModel, data.id).then(function(result) {
      var user = result.merge(data);
      
      var credentials = {
        action: self.ABIBAO_CONST_TOKEN_AUTH_ME,
        id: data.id, 
        scope: data.scope
      };
      var token = JWT.sign(credentials, process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY, { expiresIn: 60*60*24 });
      
      return self.SystemValidateDataCommand(user).then(function() {
        return self.SystemSaveDataCommand(user).then(function() {
          callback(null, token);
        });
      });
    })
    .catch(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }

};