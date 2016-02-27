"use strict";

var nconf = require("nconf");
nconf.argv().env();

var _ = require("lodash");
var Cryptr = require("cryptr"),
cryptr = new Cryptr(nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'));

var CURRENT_ACTION = "Query";
var CURRENT_NAME = "EntityListCampaignsQuery";
 
module.exports = function(urn, callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, "execute");
    
    var id = cryptr.decrypt(_.last(_.split(urn, ":"))); // retrieve id database

    self.r.table("entities").get(id).merge(function(entity) {
      return {
        campaigns: self.r.table("campaigns").filter({company: entity("id")}).without("company").coerceTo("array").merge(function(campaign) {
          return {
            urn: "urn:abibao:campaign:"+cryptr.encrypt(campaign("id")),
            items: self.r.table("campaigns_items").filter({campaign: campaign("id")}).without("id", "campaign").coerceTo("array").merge(function(item) {
              return {
                urn: "urn:abibao:campaign:item:"+cryptr.encrypt(item("id"))
              };
            })
          }; 
        })
      };
    })
    .then(function(result) {
      if ( result.type!==self.ABIBAO_CONST_ENTITY_TYPE_COMPANY) return callback("This entity has a bad type", null);
      _.forEach(result.campaigns, function(item) {
        delete item.id;
      });
      callback(null, result.campaigns);
    })
    .catch(function(error) {
      callback(error, null);
    });
    
  } catch (e) {
    callback(e, null);
  }

};