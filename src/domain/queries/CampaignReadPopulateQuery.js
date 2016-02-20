"use strict";

var Promise = require("bluebird");

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'CampaignReadPopulateQuery';
 
module.exports = function(urn) {
  
  var self = this;
  var time_start = new Date();
  var time_end;
  
  return new Promise(function(resolve, reject) {
    try {
       self.r.table('campaigns').get( self.getIDfromURN(urn) ).without('id').merge(function(campaign) {
        return {
          urn: urn,
          company: self.getURNfromID(campaign('company'), 'entity'),
          items: self.r.table('campaigns_items').filter({'campaign':self.getIDfromURN(urn)}).coerceTo('array').merge(function(item) {
            return {
              urn: self.getURNfromID(item('id'), 'campaign:item'),
            };
          })
        };
      })
      .then(function(campaign) {
        time_end = new Date();
        self.logger.debug(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
        resolve(campaign);
      })
      .catch(function(error) {
        time_end = new Date();
        self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
        reject(error);
      });
    } catch (e) {
      time_end = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
      reject(e);
    }
  });
  
};

