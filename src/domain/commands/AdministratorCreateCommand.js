"use strict";

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'AdministratorCreateCommand';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    data.id = new ObjectId().toString();
    data.createdAt = Date.now();
    data.modifiedAt = data.createdAt;
    var administrator = new self.AdministratorModel(data);
    
    self.AdministratorEmailAlreadyExistsQuery(administrator.email).then(function() {
      return self.SystemValidateDataCommand(administrator).then(function() {
        return self.SystemSaveDataCommand(administrator).then(function(created) {
          if (process.env.ABIBAO_API_GATEWAY_PRODUCTION_ENABLE) self.postMessageOnSlack('info', CURRENT_NAME+' < '+created.email+' >'); 
          callback(null, created);
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
