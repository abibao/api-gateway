"use strict";

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'SystemSaveDataCommand';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');

    data.save().then(function(result) {
      callback(null, result);
    })
    .catch(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }
  
};