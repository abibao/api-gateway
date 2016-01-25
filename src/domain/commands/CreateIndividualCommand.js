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
    var individual = new self.IndividualModel(data);
    
    self.IndividualEmailAlreadyExistsQuery(individual.email).then(function() {
      return self.ValidateDataCommand(individual).then(function() {
        return self.SaveDataCommand(individual).then(function(created) {
          if (process.env.ABIBAO_API_GATEWAY_PRODUCTION_ENABLE) self.postMessageOnSlack('info', CURRENT_NAME+' < '+created.email+' >'); 
          return self.SendIndividualEmailVerificationCommand(created.email).then(function() {
            callback(null, created);
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
