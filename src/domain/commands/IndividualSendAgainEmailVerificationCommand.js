"use strict";

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'IndividualSendAgainEmailVerificationCommand';

module.exports = function(credentials, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    if ( credentials.action===undefined ) return callback('Action is undefined');
    if ( credentials.action!==self.ABIBAO_CONST_TOKEN_AUTH_ME ) return callback('Action is unauthorized');
    if ( credentials.scope===undefined ) return callback('Scope is undefined');
    if ( credentials.scope!==self.ABIBAO_CONST_USER_SCOPE_INDIVIDUAL ) return callback('Scope is unauthorized');
    
    return self.SystemReadDataQuery(self.IndividualModel, credentials.id).then(function(individual) {
      if (individual.verified===true) return callback('Email already verified.', null);
      return self.IndividualSendEmailVerificationCommand(individual.email).then(function() {
        callback(null, {email:individual.email, resend:true});
      });
    })
    .catch(function(error) {
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }
  
};
