"use strict";

var uuid = require("node-uuid");

var CURRENT_NAME = "SurveysListenerChanged";

module.exports = function() {
  
  var self = this;
  
  try {
    
    var quid = uuid.v1();
    self.debug.listener(CURRENT_NAME, quid);
    
    self.SurveyModel.changes().then(function(feed) {
      feed.each(function(error, doc) {
        if (error) {
          return error;
        }
        if (doc.isSaved() === false) {
          self.surveyDeleteEvent(doc);
        } else if (doc.getOldValue() === null) {
          self.surveyCreateEvent(doc);
        } else {
          self.surveyUpdateEvent(doc, doc.getOldValue());
        }
      });
    });
    
  } catch (e) {
    self.logger.error(self.action, self.name, e);
  }
  
};