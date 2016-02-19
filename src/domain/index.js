"use strict";

var async = require('async');
var path = require('path');
var dir = require('node-dir');

var _ = require('lodash');
var Cryptr = require("cryptr");
var cryptr = new Cryptr(process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY);

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
  Query: thinky.Query,
  r: thinky.r,
  
  ABIBAO_CONST_TOKEN_AUTH_ME: 'auth_me',
  ABIBAO_CONST_TOKEN_EMAIL_VERIFICATION: 'email_verification',
  ABIBAO_CONST_TOKEN_CAMPAIGN_PUBLISH: 'campaign_publish',
  ABIBAO_CONST_ENTITY_TYPE_CHARITY: 'charity',
  ABIBAO_CONST_ENTITY_TYPE_COMPANY: 'company',
  ABIBAO_CONST_USER_SCOPE_ADMINISTRATOR: 'administrator',
  ABIBAO_CONST_USER_SCOPE_INDIVIDUAL: 'individual',
  
  getIDfromURN: function(urn) {
    return cryptr.decrypt(_.last(_.split(urn, ':')));
  },
  
  injector: function(type, callback) {
    var self = this;
    self.logger.info('['+type+']');
    // custom
    dir.readFiles(path.resolve(__dirname, type), 
      {
        recursive: false,
        match: /.js/
      },
      function(err, content, next) {
        if (err) return callback(err, null);
        next();
      },
      function(err, files) {
        if (err) return callback(err, null);
        async.mapSeries(files, function(item, next) {
          var name = path.basename(item, '.js');
          self.logger.info('>>> ['+name+'] has just being injected');
          if (type==='models') {
            self[name] = require('./'+type+'/'+name)(self.thinky);
          } else {
            self[name] = require('./'+type+'/'+name); // Promise.promisify()
          }
          next(null, true);
        }, function(error, results) {
          callback(error, results);
        });
      });
  }
  
};