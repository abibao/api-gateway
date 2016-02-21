"use strict";

var Promise = require("bluebird");

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'CampaignCreateWithCompanyCommand';

module.exports = function(payload) {

  var self = this;
  var time_start = new Date();
  var time_end;
  
  return new Promise(function(resolve, reject) {
    try {
      payload.company = self.getIDfromURN(payload.urnCompany);
      self.CampaignCreateCommand(payload).then(function(campaign) {
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