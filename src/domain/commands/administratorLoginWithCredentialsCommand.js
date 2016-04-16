"use strict";

var Promise = require("bluebird");

module.exports = function(payload) {
  
  var CURRENT_NAME = "AdministratorLoginWithCredentialsCommand";
  
  var self = this;
  var starttime = new Date();
  
  self.debug.command('%s %o', CURRENT_NAME, payload);
  
  return new Promise(function(resolve, reject) {
    try {
      self.administratorFilterQuery({email:payload.email}).then(function(administrators) {
        if (administrators.length===0) throw new Error("Email address and/or password invalid");
        if (administrators.length>1) throw new Error("Too many emails, contact an administrator");
        var administrator = administrators[0];
        if (administrator.authenticate(payload.password)) {
          // all done then reply token
          return self.administratorCreateAuthTokenCommand(administrator.urn).then(function(token) {
            var request = {
              name: CURRENT_NAME,
              exectime: new Date() - starttime
            };
            self.logger.info({command:request}, '[command]');
            resolve({token:token});
          });
        } else {
          throw new Error("Email address and/or password invalid");
        }
      })
      .catch(function(error) {
        self.debug.error('%s %o', CURRENT_NAME, error);
        reject(error);
      });
    } catch (e) {
      self.debug.error('%s %o', CURRENT_NAME, e);
      reject(e);
    }
  });
  
};