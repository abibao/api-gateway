"use strict";

module.exports = {
  
  EVENT_INDIVIDUAL_UPDATED: 'EVENT_INDIVIDUAL_UPDATED',
  EVENT_INDIVIDUAL_CREATED: 'EVENT_INDIVIDUAL_CREATED',
  EVENT_INDIVIDUAL_EMAIL_VERIFY_SENT: 'EVENT_INDIVIDUAL_EMAIL_VERIFY_SENT',
  
  connectionHandler: function(socket) {
    socket.server.logger.info('SocketIO connection established', socket.id);
  }
};