"use strict";

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'CreateEntityCommand';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    data.id = new ObjectId().toString();
    data.createdAt = Date.now();
    data.modifiedAt = data.createdAt;
    var entity = new self.EntityModel(data);
    
    self.ValidateDataCommand(entity).then(function() {
      return self.SaveDataCommand(entity).then(function(created) {
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
