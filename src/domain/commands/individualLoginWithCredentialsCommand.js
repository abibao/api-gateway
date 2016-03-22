"use strict";

var Promise = require("bluebird");

var CURRENT_ACTION = "Command";
var CURRENT_NAME = "IndividualLoginWithCredentialsCommand";

module.exports = function(payload) {

  var self = this;
  var timeStart = new Date();
  var timeEnd;

  return new Promise(function(resolve, reject) {
    try {
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
              timeEnd = new Date();
              self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
              resolve({token:token,globalInfos:infos});
            });
          })
          .catch(function(error) {
            timeEnd = new Date();
            self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
            reject(error);
          });
        } else {
          timeEnd = new Date();
          self.logger.error(CURRENT_ACTION, CURRENT_NAME, "("+(timeEnd-timeStart)+"ms)");
          reject("ERROR_BAD_AUTHENTIFICATION");
        }
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
