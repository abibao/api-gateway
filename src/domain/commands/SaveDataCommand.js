"use strict";

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'SaveDataCommand';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');

    data.save().then(function(user_saved) {
      callback(null, user_saved);
    })
    .error(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }
  
};