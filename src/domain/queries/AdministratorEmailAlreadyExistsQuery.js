"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'AdministratorEmailAlreadyExistsQuery';

module.exports = function(email, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.FindAdministratorsQuery({email:email}, function(err, results) {
      if (err) return callback(err, null);
      if (results.length>0) return callback('Email already exists in database.', null);
      callback(null, true);
    });
    
  } catch (e) {
    callback(e, null);
  }
  
};