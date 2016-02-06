"use strict";

var CURRENT_ACTION = 'Event';
var CURRENT_NAME = 'IndividualSendEmailCampaignEvent';

module.exports = function(data) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.IndividualSendEmailCampaignCommand(data).then(function() {
      self.io.sockets.emit(self.io.EVENT_CAMPAIGN_PUBLISHED, data);
      self.SlackPostMessageCommand('info', CURRENT_NAME+' < '+data.email+' > has been invited'); 
    })
    .catch(function(error) {
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, error);
    });

  } catch (e) {
   
  }

};