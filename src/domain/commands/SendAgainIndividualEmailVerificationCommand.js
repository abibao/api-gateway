"use strict";

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'SendAgainIndividualEmailVerificationCommand';

module.exports = function(email, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');

    self.FindIndividualsQuery({email:email}).then(function(results) {
      if (results.length===0) return callback('Email not found in database.', null);
      var user = results[0];
      if (user.verified===true) return callback('Email already verified.', null);
      return self.SendIndividualEmailVerificationCommand(email).then(function(){
        callback(null, {email:email, resend:true});
      });
    })
    .catch(function(error) {
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }
  
};
