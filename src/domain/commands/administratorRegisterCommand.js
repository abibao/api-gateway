"use strict";

var Promise = require("bluebird");

module.exports = function(payload) {
  var self = this;
  return new Promise(function(resolve, reject) {
    try {
      // password confirmation
      if (payload.password1!==payload.password2) {
        throw new Error("invalid password confimation");
      }
      payload.password = payload.password1;
      delete payload.password1;
      delete payload.password2;
      // email already exists ?
      self.execute('query', 'administratorFilterQuery', {email: payload.email}).then(function(administrators) {
        if (administrators.length>0) {
          throw new Error("Email already exists in database");
        }
        // create administrator
        return self.execute('command', 'administratorCreateCommand', payload).then(function(administrator) {
          resolve(administrator);
        });
      })
      .catch(function(error) {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });
  
};