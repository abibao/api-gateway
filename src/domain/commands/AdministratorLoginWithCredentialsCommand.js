"use strict";

var Promise = require("bluebird");

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'AdministratorLoginWithCredentialsCommand';

module.exports = function(payload) {

  var self = this;
  var time_start = new Date();
  var time_end;
  
  return new Promise(function(resolve, reject) {
    try {
      self.AdministratorFilterQuery({email:payload.email}).then(function(administrators) {
        if (administrators.length===0) throw Error('User not found');
        if (administrators.length>1) throw Error('Too many emails, contact an administrator');
        var administrator = administrators[0];
        if (administrator.authenticate(payload.password)) {
          // all done then reply token
          self.AdministratorCreateAuthTokenCommand(administrator.urn).then(function(token) {
            time_end = new Date();
            self.logger.debug(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
            resolve({token:token});
          })
          .catch(function(error) {
            time_end = new Date();
            self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
            reject(error);
          });
        } else {
          time_end = new Date();
          self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
          reject('User not authenticate');
        }
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
