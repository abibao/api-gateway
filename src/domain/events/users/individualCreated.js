"use strict";

module.exports = function(data) {
  try {
    var self = this;
    // log the email as debug
    self.logger.debug('event', 'individualCreated', data.email);
    // emit the event with socket.io
    self.io.sockets.emit('individualCreated', data);
  } catch (e) {
    self.logger.error('event', 'individualCreated', e);
  }
};