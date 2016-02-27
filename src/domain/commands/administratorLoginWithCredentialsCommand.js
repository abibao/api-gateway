"use strict";

var Promise = require("bluebird");

var CURRENT_ACTION = "Command";
var CURRENT_NAME = "AdministratorLoginWithCredentialsCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      self.administratorFilterQuery({email:payload.email}).then(function(administrators) {
        if (administrators.length===0) throw Error("User not found");
        if (administrators.length>1) throw Error("Too many emails, contact an administrator");
        var administrator = administrators[0];
        if (administrator.authenticate(payload.password)) {
          // all done then reply token
          self.administratorCreateAuthTokenCommand(administrator.urn).then(function(token) {
            //self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "("+(time_end-time_start)+"ms)");
            resolve({token:token});
          })
          .catch(function(error) {
            reject(error);
          });
        } else {
          reject("User not authenticate");
        }
      })
      .catch(function(error) {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });
  
};
