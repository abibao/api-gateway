"use strict";

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'CreateSurveyConstantCommand';

module.exports = function(params, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.ReadDataQuery(self.SurveyModel, params.id).then(function(survey) {
      if ( survey.constants===undefined ) survey.constants = {};
      survey.constants[params.label] = params.description;
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
