"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'GetSurveyPopulateQuery';
 
module.exports = function(id, callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.GetSurveyQuery(id).then(function(survey) {
      return self.GetEntityQuery(survey.entity).then(function(entity) {
        survey.entity = entity;
        return self.FindSurveysItemsQuery({survey:id}).then(function(items) {
          survey.items = items;
          callback(null, survey);
        });
      });
    })
    .error(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }

};