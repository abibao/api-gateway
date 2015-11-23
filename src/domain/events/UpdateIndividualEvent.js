"use strict";

module.exports = function(data, old) {

  var self = this;
  self.action = 'Event';
  self.name = 'UpdateIndividualEvent';
  
  // log the email as debug
  self.logger.debug(self.action, self.name, {
    data: data, 
    old: old
  });
  // emit the event with socket.io
  self.io.sockets.emit('IndividualUpdated', {
    data: data, 
    old: old
  });

};