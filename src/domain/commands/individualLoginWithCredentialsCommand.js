"use strict";

var Promise = require("bluebird");

var CURRENT_ACTION = "Command";
var CURRENT_NAME = "IndividualLoginWithCredentialsCommand";

module.exports = function(payload) {

  var self = this;
  var time_start = new Date();
  var time_end;

  return new Promise(function(resolve, reject) {
    try {
      self.individualFilterQuery({email:payload.email}).then(function(individuals) {
        if (individuals.length===0) throw Error("User not found");
        if (individuals.length>1) throw Error("Too many emails, contact an individual");
        var individual = individuals[0];
        if (individual.authenticate(payload.password)) {
          // all done then reply token
          self.individualCreateAuthTokenCommand(individual.urn).then(function(token) {
            time_end = new Date();
            self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "("+(time_end-time_start)+"ms)");
            resolve({token:token});
          })
          .catch(function(error) {
            time_end = new Date();
            self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(time_end-time_start)+"ms)");
            reject(error);
          });
        } else {
          time_end = new Date();
          self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(time_end-time_start)+"ms)");
          reject("User not authenticate");
        }
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
