"use strict";

var async = require('async');
var path = require('path');
var dir = require('node-dir');
var Promise = require("bluebird");

var options = {
  host: process.env.ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST,
  port: process.env.ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT,
  db: process.env.ABIBAO_API_GATEWAY_SERVER_RETHINK_DB,
  authKey: process.env.ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY
};
var thinky = require('thinky')(options);

module.exports = {
  
  // injected
  logger: null,
  logger_slack: null,
  io: null,
  thinky: thinky,
  ThinkyErrors: thinky.Errors,
  r: thinky.r,
  
  ABIBAO_CONST_TOKEN_AUTH_ME: 'auth_me',
  ABIBAO_CONST_TOKEN_EMAIL_VERIFICATION: 'email_verification',
  ABIBAO_CONST_TOKEN_CAMPAIGN_PUBLISH: 'campaign_publish',
  ABIBAO_CONST_ENTITY_TYPE_CHARITY: 'chatiry',
  ABIBAO_CONST_ENTITY_TYPE_COMPANY: 'company',
  ABIBAO_CONST_USER_SCOPE_ADMINISTRATOR: 'administrator',
  ABIBAO_CONST_USER_SCOPE_INDIVIDUAL: 'individual',
  
  injector: function(type, callback) {
    var self = this;
    self.logger.info('['+type+']');
    dir.files(path.resolve(__dirname, type), function(err, files) {
      if (err) return callback(err, null);
      async.mapSeries(files, function(item, next) {
        var name = path.basename(item, '.js');
        self.logger.info('>>> ['+name+'] has just being injected');
        if (type==='models') {
          self[name] = require('./'+type+'/'+name)(self.thinky);
        } else {
          self[name] = Promise.promisify(require('./'+type+'/'+name));
        }
        next(null, true);
      }, function(error, results) {
        callback(error, results);
      });
    });
  }
  
};