"use strict";

var bunyan = require('bunyan');
var BunyanSlack = require('bunyan-slack');

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'SlackPostMessageCommand';

module.exports = function(type, message) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    logger_slack[type](message);
    
  } catch (e) {
    
  }
  
};

// logger to post on slack
var logger_slack = bunyan.createLogger({
  name: "slack-gateway",
  level: 'info',
  stream: new BunyanSlack({
      webhook_url: "https://hooks.slack.com/services/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",
      icon_url: "https://secure.gravatar.com/avatar/3947e5c81a09471ff5d1213862ad5ea3.jpg",
      channel: "#gateway",
      username: "AbibaoLogger",
    })
});