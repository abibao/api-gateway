"use strict";

module.exports = function(data) {

  var self = this;
  self.action = 'Event';
  self.name = 'CreateIndividualEvent';
  
  // log the email as debug
  self.logger.debug(self.action, self.name, data);
  // emit the event with socket.io
  self.io.sockets.emit('IndividualCreated', data);

};