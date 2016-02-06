"use strict";

var CURRENT_ACTION = 'Event';
var CURRENT_NAME = 'SurveyUpdateEvent';

module.exports = function(data, old) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    var io_data = {
      data: data,
      old: old
    };
    self.io.sockets.emit(self.io.EVENT_SURVEY_UPDATED, io_data);
    self.SlackPostMessageCommand('info', CURRENT_NAME+' < '+data.id+' > has been created'); 
    
  } catch (e) {

  }

};