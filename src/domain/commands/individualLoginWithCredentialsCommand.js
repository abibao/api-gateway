"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");

var CURRENT_NAME = "AdministratorLoginWithCredentialsCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      
      var request = {
        CURRENT_NAME: CURRENT_NAME,
        QUID: uuid.v1()
      };
      self.logger.info({command:request}, '[command]');
      
      self.individualFilterQuery({email:payload.email}).then(function(individuals) {
        if (individuals.length===0) {
          return reject("ERROR_BAD_AUTHENTIFICATION");
        }
        if (individuals.length>1) {
          return reject( new Error("Too many emails, contact an individual") );
        }
        var individual = individuals[0];
        if (individual.authenticate(payload.password)) {
          // all done then reply token
          self.individualCreateAuthTokenCommand(individual.urn).then(function(token) {
            var credentials = {
              action: self.ABIBAO_CONST_TOKEN_AUTH_ME,
              urn: individual.urn, 
              scope: individual.scope
            };
            return self.authentificationGlobalInformationsQuery(credentials).then(function(infos) {
              resolve({token:token,globalInfos:infos});
            });
          })
          .catch(function(error) {
            reject(error);
          });
        } else {
          reject("ERROR_BAD_AUTHENTIFICATION");
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
