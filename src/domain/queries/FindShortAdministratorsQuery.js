"use strict";

module.exports = function(params, callback) {

  var self = this;
  self.action = 'Query';
  self.name = 'FindShortAdministratorsQuery';
  
  // get administrators (minimal values)
  self.AdministratorModel
  .filter(params)
  .run()
  .then(function(data) {
    if (data.length === 0 ) {
      return callback(new Error('No administrator matched in database.'), null);
    }
    callback(null, data);
  })
  .error(function(error) {
    self.logger.error(self.action, self.name, error);
    callback(error, null);
  });
  
};