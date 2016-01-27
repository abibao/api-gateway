"use strict";

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'CreateSurveyItemCommand';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');

    data.id = new ObjectId().toString();
    data.createdAt = Date.now();
    data.modifiedAt = data.createdAt;
    data.component = JSON.parse(data.component);
    var survey_item = new self.SurveyItemModel(data);
    
    self.ReadDataQuery(self.SurveyModel, data.survey).then(function(survey) {
      return self.ValidateDataCommand(survey_item).then(function() {
        return self.SaveDataCommand(survey_item).then(function() {
          if ( survey.items===undefined ) survey.items = [];
          survey.items.push(data.id);
          return self.ValidateDataCommand(survey).then(function() {
            return self.SaveDataCommand(survey).then(function() {
              callback(null, survey_item);
            });
          });
        });
      });
    })
    .catch(function(error) {
      data.delete().then(function() {
      });
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }
  
};
