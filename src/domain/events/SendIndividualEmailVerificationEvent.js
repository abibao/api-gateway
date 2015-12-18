"use strict";

module.exports = function(email) {

  var self = this;
  self.action = 'Event';
  self.name = 'SendIndividualEmailVerificationEvent';
  
  // log the email as debug
  self.logger.debug(self.action, self.name, email);
  // emit the event with socket.io
  self.io.sockets.emit('IndividualEmailVerificationSent', email);

};