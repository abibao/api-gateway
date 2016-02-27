"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "AdministratorLoginWithCredentialsCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      self.administratorFilterQuery({email:payload.email}).then(function(administrators) {
        if (administrators.length===0) throw Error("User not found");
        if (administrators.length>1) throw Error("Too many emails, contact an administrator");
        var administrator = administrators[0];
        if (administrator.authenticate(payload.password)) {
          // all done then reply token
          self.administratorCreateAuthTokenCommand(administrator.urn).then(function(token) {
            self.debug.command(CURRENT_NAME, quid);
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
