"use strict";

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'VerifyIndividualEmailCommand';

module.exports = function(email, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    if (email===undefined) return callback('Email is undefined.', null);
    self.FindIndividualsQuery({email:email}).then(function(results) {
      if (results.length===0) return callback('Email not found in database.', null);
      if (results.length>2) return callback('Too many emails in database.', null);
      var user = results[0];
      // already verified ?
      if (user.verified===true) {
        return callback('Email already verified.', null);
      }
      // save data
      user.verified = true;
      self.UpdateIndividualCommand(user).then(function(user) {
        return callback(null, {email:user.email,verified:user.verified});
      })
      .error(function(error) {
        callback(error, null);
      });
    })
    .error(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }
  
};