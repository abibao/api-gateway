"use strict";

var CURRENT_ACTION = 'Listener';
var CURRENT_NAME = 'SurveysListenerChanged';

module.exports = function() {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.SurveyModel.changes().then(function(feed) {
      feed.each(function(error, doc) {
        if (error) return self.logger.error(self.action, self.name, error);
        if (doc.isSaved() === false) {
          console.log(":The following document was deleted:");
          console.log(doc);
        } else if (doc.getOldValue() === null) {
          self.SurveyCreateEvent(doc);
        } else {
          var old = doc.getOldValue();
          self.SurveyUpdateEvent(doc, old);
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