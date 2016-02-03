"use strict";

var CURRENT_ACTION = 'Event';
var CURRENT_NAME = 'IndividualsListenerChanged';

module.exports = function(callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.IndividualModel.changes().then(function(feed) {
      feed.each(function(error, doc) {
        if (error) {
          return callback(error, null);
        }
        if (doc.isSaved() === false) {
          console.log("The following document was deleted:");
          console.log(doc);
        }
        else if (doc.getOldValue() === null) {
          delete doc.password;
          return self.IndividualCreateEvent(doc).then(function() {
            return callback(null, true);
          });
        }
        else {
          var old = doc.getOldValue();
          delete doc.password;
          delete old.password;
          return self.IndividualUpdateEvent(doc, old).then(function() {
            return callback(null, true);
          });
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