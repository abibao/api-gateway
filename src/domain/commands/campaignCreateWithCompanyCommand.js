"use strict";

var Promise = require("bluebird");

var CURRENT_ACTION = "Command";
var CURRENT_NAME = "CampaignCreateWithCompanyCommand";

module.exports = function(payload) {

  var self = this;
  var timeStart = new Date();
  var timeEnd;
  
  return new Promise(function(resolve, reject) {
    try {
      payload.company = self.getIDfromURN(payload.urnCompany);
      self.campaignCreateCommand(payload).then(function(campaign) {
        timeEnd = new Date();
        self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
        resolve(campaign);
      })
      .catch(function(error) {
        timeEnd = new Date();
        self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
        reject(error);
      });
    } catch (e) {
      timeEnd = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
      reject(e);
    }
  });
  
};