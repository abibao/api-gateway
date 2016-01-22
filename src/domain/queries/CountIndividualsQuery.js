"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'CountIndividualsQuery';

module.exports = function(callback) {
  
  var self = this;

  try {

    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.IndividualModel.count().execute().then(function(total) {
      callback(null, {count: total});
    })
    .error(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }
  
};