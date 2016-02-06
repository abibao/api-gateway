"use strict";

var CURRENT_ACTION = 'Event';
var CURRENT_NAME = 'IndividualUpdateEvent';

module.exports = function(data, old) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    var io_data = {
      data: data,
      old: old
    };
    self.io.sockets.emit(self.io.EVENT_INDIVIDUAL_CREATED, io_data);
    self.SlackPostMessageCommand('info', CURRENT_NAME+' < '+data.email+' > has been updated'); 

  } catch (e) {
   
  }

};