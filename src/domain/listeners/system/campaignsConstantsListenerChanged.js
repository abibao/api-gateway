"use strict";

var uuid = require("node-uuid");

var CURRENT_NAME = "CampaignsConstantsListenerChanged";

module.exports = function() {
  
  var self = this;
  
  try {
    
    var quid = uuid.v1();
    self.debug.query(CURRENT_NAME, quid);
    
    self.CampaignConstantModel.changes().then(function(feed) {
      feed.each(function(error, doc) {
        if (error) {
          return error;
        }
        if (doc.isSaved() === false) {
          self.campaignConstantDeleteEvent(doc);
        } else if (doc.getOldValue() === null) {
          self.campaignConstantCreateEvent(doc);
        } else {
          self.campaignConstantUpdateEvent(doc, doc.getOldValue());
        }
      });
    });
    
  } catch (e) {
    self.logger.error(self.action, self.name, e);
  }
  
};