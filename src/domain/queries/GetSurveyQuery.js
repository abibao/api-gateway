"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'GetSurveyQuery';

module.exports = function(id, callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.SurveyModel.get(id).run().then(function(result) {
      callback(null, result);
    }).catch(self.ThinkyErrors.DocumentNotFound, function(err) {
      callback(err, null);
    }).error(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }

};