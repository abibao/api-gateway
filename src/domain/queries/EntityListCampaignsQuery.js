"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'EntityListCampaignsQuery';
 
module.exports = function(id, callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    self.SystemReadDataQuery(self.EntityModel, id).then(function(entity) {
      if ( entity.type!==self.ABIBAO_CONST_ENTITY_TYPE_COMPANY) return callback('This entity has a bad type.', null);
      return self.SystemFindDataQuery(self.CampaignModel, {company: entity.id}).then(function(campaigns) {
        callback(null, campaigns);
      });
    })
    .catch(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }

};