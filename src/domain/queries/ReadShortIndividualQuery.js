"use strict";

module.exports = function(id, callback) {

  var self = this;
  self.action = 'Query';
  self.name = 'ReadShortIndividualQuery';
  
  // get an individual (minimul values)
  self.IndividualModel
  .get(id)
  .run()
  .then(function(data) {
    delete data.password;
    callback(null, data);  
  })
  .catch(self.ThinkyErrors.DocumentNotFound, function(err) {
    if (err) {}
    self.logger.error(self.action, self.name, 'Individual not found in database.');
    return callback(new Error('Individual not found in database.'), null);
  })
  .error(function(error) {
    self.logger.error(self.action, self.name, error);
    callback(error, null);
  });
  
};