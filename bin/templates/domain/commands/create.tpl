"use strict";

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = '{{JS_COMMAND_NAME}}';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    data.id = new ObjectId().toString();
    // ... insert here your own default values
    var model = new self.{{JS_MODEL_NAME}}(data);
    
    self.SystemValidateDataCommand(model).then(function() {
      return self.SystemSaveDataCommand(model).then(function(created) {
        callback(null, created);
      });
    })
    .catch(function(error) {
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }

};