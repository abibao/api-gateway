"use strict";

module.exports = function(email, callback) {

  var self = this;
  self.action = 'Query';
  self.name = 'FindShortAdministratorByEmailQuery';
  
  // get an individual (minimal values)
  self.AdministratorModel
  .filter({email: email})
  .run()
  .then(function(data) {
    if (data.length === 0 ) {
      return callback(new Error('Administrator not found in database.'), null);
    }
    if (data.length >= 2 ) {
      return callback(new Error('Multiple Administrators found in database.'), null);
    }
    callback(null, data[0]);
  })
  .error(function(error) {
    self.logger.error(self.action, self.name, error);
    callback(error, null);
  });
  
};