"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'UserFindQuery';

module.exports = function(filter, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.SystemFindDataCommand(self.UserModel, filter).then(function(models) {
      callback(null, models);
    })
    .catch(function(error) {
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }

};
