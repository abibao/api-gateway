"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");
var _ = require("lodash");

var CURRENT_NAME = "IndividualUpdateCharityCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      if ( _.isUndefined(payload.credentials.action) ) { return reject( new Error("Action is undefined") ); }
      if ( payload.credentials.action!==self.ABIBAO_CONST_TOKEN_AUTH_ME ) { return reject( new Error("Action is unauthorized") ); }
      self.entityReadQuery(payload.charity).then(function(charity) {
        if ( charity.type!==self.ABIBAO_CONST_ENTITY_TYPE_CHARITY ) { return reject( new Error("This is not a Charity") ); }
        return self.individualReadQuery(payload.credentials.urn).then(function(individual) {
          if ( individual.urnCharity===charity.urn ) { return reject( new Error("Charity already affected") ); }
          return self.individualUpdateCommand({ urn:payload.credentials.urn, charity:self.getIDfromURN(charity.urn) }).then(function(individual) {
            self.debug.query(CURRENT_NAME, quid);
            resolve(individual);
          });
        });
      }).catch(function(error) {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });
  
};