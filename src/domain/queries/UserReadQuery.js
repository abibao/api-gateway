"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'UserReadQuery';

module.exports = function(id, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.SystemReadDataQuery(self.UserModel, id).then(function(model) {
      callback(null, model);
    })
    .catch(function(error) {
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }

};
