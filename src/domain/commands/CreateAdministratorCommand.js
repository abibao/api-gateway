"use strict";

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'CreateAdministratorCommand';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    data.id = new ObjectId().toString();
    data.createdAt = Date.now();
    data.modifiedAt = data.createdAt;
    var user = new self.AdministratorModel(data);
    
    self.AdministratorEmailAlreadyExistsQuery(user.email).then(function() {
      return self.ValidateDataCommand(user).then(function() {
        return self.SaveDataCommand(user).then(function(user_saved) {
          if (process.env.ABIBAO_API_GATEWAY_PRODUCTION_ENABLE) self.postMessageOnSlack('info', 'event individualCreated'+' < '+user_saved.email+' >'); 
          callback(null, user_saved);
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
