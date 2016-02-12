"use strict";

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'SystemDeleteDataCommand';

module.exports = function(model, data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');

    self.SystemReadDataQuery(model, data.id).then(function(data) {
      return data.delete().then(function() {
        callback();
      });
    })
    .catch(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }
  
};