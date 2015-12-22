"use strict";

module.exports = function() {
  
  var self = this;
  self.action = 'Event';
  self.name = 'IndividualsListenerChanged';
  
  try {
    self.IndividualModel.changes().then(function(feed) {
      feed.each(function(error, doc) {
        if (error) {
          self.logger.error(self.action, self.name, error);
        }
        if (doc.isSaved() === false) {
          console.log("The following document was deleted:");
          console.log(doc);
        }
        else if (doc.getOldValue() === null) {
          delete doc.password;
          self.CreateIndividualEvent(doc);
        }
        else {
          var old = doc.getOldValue();
          delete doc.password;
          delete old.password;
          self.UpdateIndividualEvent(doc, old);
        }
      });
    }).error(function(error) {
      self.logger.error(self.action, self.name, error);
    });
  } catch (e) {
    self.logger.error(self.action, self.name, e);
  }
  
};