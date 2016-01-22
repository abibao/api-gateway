"use strict";

var CURRENT_ACTION = 'Event';
var CURRENT_NAME = 'SendIndividualEmailVerificationEvent';

module.exports = function(email, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.io.sockets.emit(self.io.EVENT_INDIVIDUAL_EMAIL_VERIFY_SENT, email);
    callback(null, true);
    
  } catch (e) {
    self.logger.error(CURRENT_ACTION, CURRENT_NAME, e);
    callback(e, null);
  }

};