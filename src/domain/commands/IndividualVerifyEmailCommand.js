"use strict";

var Iron = require('iron');
var Base64 = require('base64-url');

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'IndividualVerifyEmailCommand';

module.exports = function(sealed, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    sealed = Base64.decode(sealed);
    
    Iron.unseal(sealed, process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY, Iron.defaults, function (err, unsealed) {
      // control
      if (err) return callback(err, null);
      if (unsealed.email===undefined) return callback('Email is undefined.', null);
      if (unsealed.action===undefined) return callback('Action is undefined.', null);
      if (unsealed.action!==self.ABIBAO_CONST_TOKEN_EMAIL_VERIFICATION) return callback('Action is unauthorized.', null);
      // resolve
      self.SystemFindDataQuery(self.IndividualModel, {email:unsealed.email}).then(function(results) {
        if (results.length===0) return callback('Email not found in database.', null);
        if (results.length>2) return callback('Too many emails in database.', null);
        var user = results[0];
        // already verified ?
        if (user.verified===true) {
          return callback('Email already verified.', null);
        }
        // save data
        user.verified = true;
        self.SystemUpdateDataCommand(self.IndividualModel, user).then(function(user) {
          return callback(null, {email:user.email,verified:user.verified});
        })
        .catch(function(error) {
          callback(error, null);
        });
      })
      .catch(function(error) {
        callback(error, null);
      });
    });
    
  } catch (e) {
    callback(e, null);
  }
  
};