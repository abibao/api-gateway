"use strict";

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'SendAgainIndividualEmailVerificationCommand';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');

    return self.GetIndividualQuery(data).then(function(user) {
      if (user.verified===true) return callback('Email already verified.', null);
      return self.SendIndividualEmailVerificationCommand(user.email).then(function() {
        callback(null, {email:user.email, resend:true});
      });
    })
    .catch(function(error) {
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }
  
};
