"use strict";

var Promise = require("bluebird");

var CURRENT_ACTION = "Command";
var CURRENT_NAME = "IndividualRegisterCommand";

module.exports = function(payload) {

  var self = this;
  var timeStart = new Date();
  var timeEnd;
  
  return new Promise(function(resolve, reject) {
    try {
      // password confirmation
      if (payload.password1!==payload.password2) {
        return reject( new Error("invalid password confimation") );
      }
      payload.password = payload.password1;
      delete payload.password1;
      delete payload.password2;
      // email already exists ?
      self.individualFilterQuery({email: payload.email}).then(function(individuals) {
        if (individuals.length>0) {
          return reject( new Error("Email already exists in database") );
        }
        // create individual
        self.individualCreateCommand(payload).then(function(individual) {
          timeEnd = new Date();
          self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
          resolve(individual);
        });
      })
      .catch(function(error) {
        timeEnd = new Date();
        self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
        reject(error);
      });
    } catch (e) {
      timeEnd = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
      reject(e);
    }
  });
  
};