"use strict";

var uuid = require("node-uuid");

var CURRENT_NAME = "AdministratorsListenerChanged";

module.exports = function() {
  
  var self = this;
  
  try {
    
    var quid = uuid.v1();
    self.debug.listener(CURRENT_NAME, quid);
    
    self.AdministratorModel.changes().then(function(feed) {
      feed.each(function(error, doc) {
        if (error) {
          return error;
        }
        if (doc.isSaved() === false) {
          self.administratorDeleteEvent(doc);
        } else if (doc.getOldValue() === null) {
          self.administratorCreateEvent(doc);
        } else {
          self.administratorUpdateEvent(doc, doc.getOldValue());
        }
      });
    });
    
  } catch (e) {
    self.logger.error(self.action, self.name, e);
  }
  
};