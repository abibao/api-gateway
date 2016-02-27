"use strict";

var uuid = require("node-uuid");

var CURRENT_NAME = "IndividualsListenerChanged";

module.exports = function() {
  
  var self = this;
  
  try {
    
    var quid = uuid.v1();
    self.debug.query(CURRENT_NAME, quid);
    
    self.IndividualModel.changes().then(function(feed) {
      feed.each(function(error, doc) {
        if (error) return self.logger.error(self.action, self.name, error);
        if (doc.isSaved() === false) {
          self.IndividualDeleteEvent(doc);
        } else if (doc.getOldValue() === null) {
          self.IndividualCreateEvent(doc);
        } else {
          self.IndividualUpdateEvent(doc, doc.getOldValue());
        }
      });
    });
    
  } catch (e) {
    self.logger.error(self.action, self.name, e);
  }
  
};