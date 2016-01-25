"use strict";

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'CreateSurveyCommand';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    data.id = new ObjectId().toString();
    data.createdAt = Date.now();
    data.modifiedAt = data.createdAt;
    var survey = new self.SurveyModel(data);
    
    self.GetEntityQuery(data.entity).then(function() {
      return self.ValidateDataCommand(survey).then(function() {
        return self.SaveDataCommand(survey).then(function(created) {
          callback(null, created);
        });
      });
    })
    .catch(function(error) {
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }
  
};
