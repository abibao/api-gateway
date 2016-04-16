"use strict";

var Promise = require("bluebird");

module.exports = function(payload) {
  
  var CURRENT_NAME = "IndividualRegisterCommand";
  
  var self = this;
  var starttime = new Date();
  
  self.debug.command('%s %o', CURRENT_NAME, payload);
  
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
      self.individualFilterQuery({email: payload.email}).then(function(individuals) {
        if (individuals.length>0) {
          throw new Error("Email already exists in database");
        }
        // create individual
        self.individualCreateCommand(payload).then(function(individual) {
          var request = {
            name: CURRENT_NAME,
            exectime: new Date() - starttime
          };
          self.logger.info({command:request}, '[command]');
          resolve(individual);
        });
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