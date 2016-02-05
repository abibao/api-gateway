"use strict";

var CURRENT_ACTION = 'Event';
var CURRENT_NAME = 'EntitiesListenerChanged';

module.exports = function() {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.EntityModel.changes().then(function(feed) {
      feed.each(function(error, doc) {
        if (error) return self.logger.error(self.action, self.name, error);
        if (doc.isSaved() === false) {
          console.log(":The following document was deleted:");
          console.log(doc);
        }
        else if (doc.getOldValue() === null) {
          return self.EntityCreateEvent(doc);
        }
        else {
          var old = doc.getOldValue();
          return self.EntityUpdateEvent(doc, old);
        }
      });
    })
    .catch(function(error) {
      self.logger.error(self.action, self.name, error);
    });
    
  } catch (e) {
    self.logger.error(self.action, self.name, e);
  }
  
};