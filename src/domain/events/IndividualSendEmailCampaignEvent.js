"use strict";

var Promise = require("bluebird");

var CURRENT_ACTION = "Event";
var CURRENT_NAME = "IndividualSendEmailCampaignEvent";

module.exports = function(data) {
  
  var self = this;
  var time_start = new Date();
  var time_end;
  
  return new Promise(function(resolve, reject) {
    try {
      self.IndividualSendEmailCampaignCommand(data).then(function() {
        time_end = new Date();
        self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "("+(time_end-time_start)+"ms)");
        resolve();
      })
      .catch(function(error) {
        time_end = new Date();
        self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(time_end-time_start)+"ms)");
        reject(error);
      });
    } catch (e) {
      time_end = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(time_end-time_start)+"ms)");
      reject(e);
    }
  });
  
};