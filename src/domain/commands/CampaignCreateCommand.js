"use strict";

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'CampaignCreateCommand';

module.exports = function(data, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    data.id = new ObjectId().toString();
    data.createdAt = Date.now();
    data.modifiedAt = data.createdAt;
    var campaign = new self.CampaignModel(data);
    
    self.SystemReadDataQuery(self.EntityModel, data.company).then(function(entity) {
      if ( entity.type!==self.ABIBAO_CONST_ENTITY_TYPE_COMPANY) return callback('This entity has a bad type.', null);
      return self.SystemValidateDataCommand(campaign).then(function() {
        return self.SystemSaveDataCommand(campaign).then(function(created) {
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
