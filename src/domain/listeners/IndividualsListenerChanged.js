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
          return self.CreateIndividualEvent(doc).then(function() {
            return callback(null, true);
          });
        }
        else {
          var old = doc.getOldValue();
          delete doc.password;
          delete old.password;
          return self.UpdateIndividualEvent(doc, old).then(function() {
            return callback(null, true);
          });
        }
      });
    })
    .error(function(error) {
      self.logger.error(self.action, self.name, error);
    });
    
  } catch (e) {
    self.logger.error(self.action, self.name, e);
  }
  
};