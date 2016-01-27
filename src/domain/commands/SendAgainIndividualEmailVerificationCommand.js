"use strict";

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'SendAgainIndividualEmailVerificationCommand';

module.exports = function(id, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');

    return self.ReadDataQuery(self.IndividualModel, id).then(function(individual) {
      if (individual.verified===true) return callback('Email already verified.', null);
      return self.SendIndividualEmailVerificationCommand(individual.email).then(function() {
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
