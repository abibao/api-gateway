"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");
var _ = require("lodash");

var CURRENT_NAME = "SurveyReadPopulateControlIndividualQuery";
 
module.exports = function(payload) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      var idSurvey = self.getIDfromURN(payload.urn);
      self.r.table("surveys").get(idSurvey).merge(function(survey) {
        return {
          company: self.r.table("entities").get(survey("company"))("type"),
          campaign: self.r.table("campaigns").get(survey("campaign")).merge(function(campaign) {
            return {
              urn: survey("id"),
              items: self.r.table("campaigns_items").filter({campaign: campaign("id")}).coerceTo("array").merge(function(item) {
                return {
                  constants: self.r.table("campaigns_constants").filter({prefix: item("constants")}).coerceTo("array").pluck("prefix", "suffix", "fr").map(function(constant) {
                    return {
                      name: constant("prefix").add("__").add(constant("suffix")),
                      frFR: constant("fr")
                    };
                  })
                };
              }).without("id", "campaign", "createdAt", "modifiedAt")
            };
          }).without("id", "company", "price", "currency", "createdAt", "modifiedAt")
        };
      }).without("id", "charity", "individual")
      .then(function(survey) {
        survey.individual = payload.credentials.urn;
        survey.survey = payload.urn;
        survey.name = survey.campaign.name;
        if ( survey.company===self.ABIBAO_CONST_ENTITY_TYPE_COMPANY ) { survey.fromCompany=true; }
        if ( survey.company===self.ABIBAO_CONST_ENTITY_TYPE_ABIBAO ) { survey.fromAbibao=true; }
        if ( survey.company===self.ABIBAO_CONST_ENTITY_TYPE_CHARITY ) { survey.fromCharity=true; }
        if ( survey.fromAbibao ) { survey.fromAbibaoPosition = survey.campaign.abibao; }
        survey.dictionary = {};
        _.map(survey.campaign.items, function(item) {
          var mapping = [];
          _.map(item.constants, function(constant) {
            mapping.push(constant.name);
            survey.dictionary[constant.name] = {
              frFR: constant.frFR
            };
          });
          item.constants = mapping;
          survey.items = survey.campaign.items;
          if ( _.isUndefined(survey.answers) ) { survey.answers={}; }
          
        });
        delete survey.campaign;
        delete survey.company;
        self.debug.query(CURRENT_NAME, quid);
        resolve(survey);
      })
      .catch(function(error) {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });
  
};