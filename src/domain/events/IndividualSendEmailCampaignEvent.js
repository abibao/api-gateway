"use strict";

var Promise = require("bluebird");

var CURRENT_ACTION = "Event";
var CURRENT_NAME = "IndividualSendEmailCampaignEvent";

module.exports = function(data) {
  
  var self = this;
  var timeStart = new Date();
  var timeEnd;
  
  return new Promise(function(resolve, reject) {
    try {
      self.IndividualSendEmailCampaignCommand(data).then(function() {
        timeEnd = new Date();
        self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
        resolve();
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