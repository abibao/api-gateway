"use strict";

var CURRENT_ACTION = 'Listener';
var CURRENT_NAME = 'IndividualsListenerChanged';

module.exports = function() {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME);
    
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