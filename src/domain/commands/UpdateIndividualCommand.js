"use strict";

module.exports = function(data, callback) {
 
  var self = this;
  self.action = 'Command';
  self.name = 'UpdateIndividualCommand';
  
  try {
    self.IndividualModel.get(data.id).run().then(function(user) {
      user.merge(data).save().then(function() {
        callback(null, user);
      });
    });
  } catch (e) {
    self.logger.error(self.action, self.name, e);
    callback(e, null);
  }
  
};