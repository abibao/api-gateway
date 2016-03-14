"use strict";

var uuid = require("node-uuid");

var CURRENT_NAME = "CampaignsItemsChoicesListenerChanged";

module.exports = function() {
  
  var self = this;
  
  try {
    
    var quid = uuid.v1();
    self.debug.listener(CURRENT_NAME, quid);
    
    self.CampaignItemChoiceModel.changes().then(function(feed) {
      feed.each(function(error, doc) {
        if (error) {
          return error;
        }
        if (doc.isSaved() === false) {
          self.campaignItemChoiceDeleteEvent(doc);
        } else if (doc.getOldValue() === null) {
          self.campaignItemChoiceCreateEvent(doc);
        } else {
          self.campaignItemChoiceUpdateEvent(doc, doc.getOldValue());
        }
      });
    });
    
  } catch (e) {
    self.logger.error(self.action, self.name, e);
  }
  
};