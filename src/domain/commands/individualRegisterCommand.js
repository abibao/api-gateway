"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "IndividualRegisterCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
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
          return reject( new Error("Email already exists in database") ); // 200 plus message
        }
        // create individual
        self.individualCreateCommand(payload).then(function(individual) {
          self.debug.command(CURRENT_NAME, quid);
          resolve(individual);
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