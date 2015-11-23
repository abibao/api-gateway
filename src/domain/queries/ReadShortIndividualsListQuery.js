"use strict";

module.exports = function(startIndex, nbIndexes, callback) {
  
  try {
    
    var self = this;
    self.action = 'Query';
    self.name = 'ReadShortIndividualsListQuery';
    
    startIndex = startIndex - 1;
    var endIndex = startIndex + nbIndexes;
    
    self.IndividualModel.orderBy('email').slice(startIndex, endIndex).run()
    .then(function(documents) {
      self.logger.info(self.action, self.name, 'documents:', documents.length);
      callback(null, documents);
    }).catch(self.ThinkyErrors.DocumentNotFound, function(err) {
      self.logger.error(self.action, self.name, err);
      callback(err, null);
    }).error(function(error) {
      self.logger.error(self.action, self.name, error);
      callback(error, null);
    });
    
  } catch (e) {
    self.logger.error(self.action, self.name, e);
    callback(e, null);
  }

};