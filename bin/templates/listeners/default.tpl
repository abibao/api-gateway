"use strict";

var CURRENT_ACTION = "Listener";
var CURRENT_NAME = "{{JS_LISTENER_NAME}}";

module.exports = function() {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME);
    
    self.{{JS_MODEL_NAME}}.changes().then(function(feed) {
      feed.each(function(error, doc) {
        if (error) return self.logger.error(self.action, self.name, error);
        if (doc.isSaved() === false) {
          self.{{JS_EVENT_NAME}}DeleteEvent(doc);
        } else if (doc.getOldValue() === null) {
          self.{{JS_EVENT_NAME}}CreateEvent(doc);
        } else {
          self.{{JS_EVENT_NAME}}UpdateEvent(doc, doc.getOldValue());
        }
      });
    });
    
  } catch (e) {
    self.logger.error(self.action, self.name, e);
  }
  
};