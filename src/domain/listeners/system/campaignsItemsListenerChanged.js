"use strict";

var uuid = require("node-uuid");

var CURRENT_NAME = "CampaignsItemsListenerChanged";

module.exports = function() {
  
  var self = this;
  
  try {
    
    var quid = uuid.v1();
    self.debug.query(CURRENT_NAME, quid);
    
    self.CampaignItemModel.changes().then(function(feed) {
      feed.each(function(error, doc) {
        if (error) return self.logger.error(self.action, self.name, error);
        if (doc.isSaved() === false) {
          self.campaignItemDeleteEvent(doc);
        } else if (doc.getOldValue() === null) {
          self.campaignItemCreateEvent(doc);
        } else {
          self.campaignItemUpdateEvent(doc, doc.getOldValue());
        }
      });
    });
    
  } catch (e) {
    self.logger.error(self.action, self.name, e);
  }
  
};