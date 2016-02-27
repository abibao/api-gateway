"use strict";

var Promise = require("bluebird");

var CURRENT_ACTION = "Command";
var CURRENT_NAME = "IndividualRegisterCommand";

module.exports = function(payload) {

  var self = this;
  var time_start = new Date();
  var time_end;
  
  return new Promise(function(resolve, reject) {
    try {
      // password confirmation
      if (payload.password1!==payload.password2) throw Error("invalid password confimation");
      payload.password = payload.password1;
      delete payload.password1;
      delete payload.password2;
      // email already exists ?
      self.individualFilterQuery({email: payload.email}).then(function(individuals) {
        if (individuals.length>0) throw Error("Email already exists in database");
        // create individual
        self.individualCreateCommand(payload).then(function(individual) {
          time_end = new Date();
          self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "("+(time_end-time_start)+"ms)");
          resolve(individual);
        });
      })
      .catch(function(error) {
        time_end = new Date();
        self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(time_end-time_start)+"ms)");
        reject(error);
      });
    } catch (e) {
      time_end = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(time_end-time_start)+"ms)");
      reject(e);
    }
  });
  
};