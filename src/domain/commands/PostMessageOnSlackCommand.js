"use strict";

module.exports = function(type, message) {
  
  var self = this;
  
  // post a message on Slack #apigateway
  self.logger_slack[type](message);
  
};