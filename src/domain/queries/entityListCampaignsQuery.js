"use strict";

var nconf = require("nconf");
nconf.argv().env();

var _ = require("lodash");
var Cryptr = require("cryptr"),
cryptr = new Cryptr(nconf.get("ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY"));

var CURRENT_ACTION = "Query";
var CURRENT_NAME = "EntityListCampaignsQuery";
 
module.exports = function(urn) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "execute");
      var id = self.getIDfromURN(urn);
      self.r.table("entities").get(id).merge(function(entity) {
        return {
          campaigns: self.r.table("campaigns").filter({company: entity("id")}).without("company").coerceTo("array").merge(function(campaign) {
            return {
              urn: campaign("id"),
              items: self.r.table("campaigns_items").filter({campaign: campaign("id")}).without("id", "campaign").coerceTo("array").merge(function(item) {
                return {
                  urn: "urn:abibao:database:campaign:item:"+cryptr.encrypt(item("id"))
                };
              })
            }; 
          })
        };
      })
      .then(function(result) {
        if ( result.type!==self.ABIBAO_CONST_ENTITY_TYPE_COMPANY && result.type!==self.ABIBAO_CONST_ENTITY_TYPE_ABIBAO ) { return reject("This entity has a bad type"); }
        _.forEach(result.campaigns, function(item) {
          delete item.id;
          item.urn = self.getURNfromID(item.urn);
        });
        resolve(result.campaigns);
      })
      .catch(function(error) {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });
};