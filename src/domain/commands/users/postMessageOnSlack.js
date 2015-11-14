"use strict";

module.exports = function(type, message) {
  try {
    var self = this;
    // post a message on Slack #apigateway
    self.logger_slack[type](message);
  } catch (e) {
    self.logger.error('event', 'postMessageOnSlack', e);
  }
};