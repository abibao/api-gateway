"use strict";

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'CreateIndividualCommand';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    data.id = new ObjectId().toString();
    data.createdAt = Date.now();
    data.modifiedAt = data.createdAt;
    var user = new self.IndividualModel(data);
    
    self.IndividualEmailAlreadyExistsQuery(user.email).then(function() {
      return self.ValidateDataCommand(user).then(function() {
        return self.SaveDataCommand(user).then(function(user_saved) {
          if (process.env.ABIBAO_API_GATEWAY_PRODUCTION_ENABLE) self.postMessageOnSlack('info', 'event individualCreated'+' < '+user_saved.email+' >'); 
          return self.SendIndividualEmailVerificationCommand(user_saved.email).then(function() {
            callback(null, user_saved);
          });
        });
      });
    })
    .catch(function(error) {
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }
  
};
