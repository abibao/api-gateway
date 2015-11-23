"use strict";

module.exports = function(callback) {
  
  try {
    
    var self = this;
    self.action = 'Query';
    self.name = 'CountIndividualsQuery';

    self.IndividualModel.count().execute()
    .then(function(total) {
      self.logger.info(self.action, self.name, 'total:', total);
      callback(null, {count: total});
    }).error(function(error) {
      self.logger.error(self.action, self.name, error);
      callback(error, null);
    });
    
  } catch (e) {
    self.logger.error(self.action, self.name, e);
    callback(e, null);
  }
  
};