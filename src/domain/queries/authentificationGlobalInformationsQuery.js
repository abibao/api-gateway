"use strict";

var Promise = require("bluebird");
var _ = require("lodash");
var uuid = require("node-uuid");

var CURRENT_NAME = "AuthentificationGlobalInformationsQuery";
 
module.exports = function(credentials) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    var quid = uuid.v1();
    try {
      if ( _.isUndefined(credentials.action) ) { return reject( new Error("Action is undefined") ); }
      if ( credentials.action!==self.ABIBAO_CONST_TOKEN_AUTH_ME ) { return reject( new Error("Action is unauthorized") ); }
      switch (credentials.scope) {
        case self.ABIBAO_CONST_USER_SCOPE_INDIVIDUAL:
          credentials.id = self.getIDfromURN(credentials.urn);
          self.r.table("individuals").get(credentials.id).merge(function(individual) {
            return {
              currentCharity: self.r.table("entities").get(individual("charity")).merge(function(entity) {
                return {
                  urn: entity("id")
                };
              }).pluck("urn","name","contact","icon","avatar","picture"),
              charitiesHistory: self.r.table("surveys").filter({"individual":individual("id")})("charity").distinct().map(function(val) {
                return self.r.table("entities").get(val).merge(function(charity) {
                  return {
                    urn: charity("id"),
                    type: charity("type"),
                    me: {
                      totalSurveysCompleted: self.r.table("surveys").filter({"individual":individual("id"),"charity":charity("id"),"complete":true}).coerceTo("array").count(),
                      totalPriceCollected: self.r.table("surveys").filter({"individual":individual("id"),"charity":charity("id"),"complete":true}).coerceTo("array").eqJoin("campaign",self.r.table("campaigns")).zip().sum("price"),
                    },
                    totalIndividuals: self.r.table("surveys").filter({"charity":charity("id")}).coerceTo("array").count(),
                    totalSurveysCompleted: self.r.table("surveys").filter({"charity":charity("id"),"complete":true}).coerceTo("array").count(),
                    totalPriceCollected: self.r.table("surveys").filter({"charity":charity("id"),"complete":true}).coerceTo("array").eqJoin("campaign",self.r.table("campaigns")).zip().sum("price"),
                  };
                }).pluck("urn","type","name","me", "totalIndividuals","totalPriceCollected","totalSurveysCompleted");
              }),
              surveysCompleted: self.r.table("surveys").filter({"individual":individual("id"),"complete":true}).coerceTo("array").merge(function(survey) {
                return {
                  urn: survey("id"),
                  campaign: self.r.table("campaigns").get(survey("campaign")).merge(function() {
                    return {
                      urn: survey("campaign")
                    };
                  }).pluck("urn","name","price","currency","abibao"),
                  company: self.r.table("entities").get(survey("company")).pluck("name", "type")
                };
              }).pluck("urn","company"),
              surveysInProgress: self.r.table("surveys").filter({"individual":individual("id"),"complete":false}).coerceTo("array").merge(function(survey) {
                return {
                  urn: survey("id"),
                  campaign: self.r.table("campaigns").get(survey("campaign")).merge(function() {
                    return {
                      urn: survey("campaign")
                    };
                  }).pluck("urn","name","price","currency","abibao"),
                  company: self.r.table("entities").get(survey("company")).pluck("name", "type"),
                  charity: self.r.table("entities").get(survey("charity")).pluck("name", "type"),
                  nbItems: self.r.table("campaigns_items").filter({"campaign":survey("campaign")}).count(),
                  nbAnswers: ( survey("answers").hasFields('answers')===false ) ? 0 : survey.getField("answers").keys().count(),
                };
              }).pluck("urn","campaign","company","charity","modifiedAt","nbItems","nbAnswers","answers","complete")
            };
          }).pluck("email","charitiesHistory","currentCharity","surveysInProgress","surveysCompleted")
          .then(function(individual) {
            individual.news = [];
            individual.news.push ({
              title: "Titre de news 1",
              type: "ABIBAO_CONST_NEWS_FROM_ABIBAO",
              image: "images/news/default.png",
              description: "<p>Phasellus molestie, orci nec aliquam fermentum, nisl leo ultrices velit, sed suscipit risus augue ut nisi.</p> Ut vestibulum, erat eget pharetra finibus, risus urna viverra nunc, eu euismod turpis sem ac turpis. In laoreet ullamcorper vehicula. Phasellus nunc tortor, commodo nec iaculis non, consequat vitae neque. Aliquam nec erat elementum, dictum magna non, suscipit dolor. Donec sodales aliquam lectus non ultricies. Nulla nec luctus nulla, eget viverra purus. Phasellus volutpat erat a lectus viverra aliquam. ",
            });
            // individidual: set URN
            individual.urn = credentials.urn;
            // charitiesHistory: calculate URN
            _.map(individual.charitiesHistory, function(item) {
              item.urn = self.getURNfromID(item.urn, "entity");
            });
            // charitiesHistory: calculate URN
            individual.currentCharity.urn = self.getURNfromID(individual.currentCharity.urn, "entity");
            // surveysInProgress:  calculate URN
            _.map(individual.surveysInProgress, function(item) {
              item.urn = self.getURNfromID(item.urn, "survey");
              item.campaign.urn = self.getURNfromID(item.campaign.urn, "campaign");
            });
            // surveysCompleted:  calculate URN
            _.map(individual.surveysCompleted, function(item) {
              item.urn = self.getURNfromID(item.urn, "survey");
            });
            // split abibao surveys from others
            individual.charitiesHistory = _.filter(individual.charitiesHistory, function(o) { return o.type!==self.ABIBAO_CONST_ENTITY_TYPE_ABIBAO; });
            individual.abibaoInProgress = _.filter(individual.surveysInProgress, function(o) { return o.company.type===self.ABIBAO_CONST_ENTITY_TYPE_ABIBAO; });
            individual.surveysInProgress = _.filter(individual.surveysInProgress, function(o) { return o.company.type!==self.ABIBAO_CONST_ENTITY_TYPE_ABIBAO; });
            individual.abibaoCompleted = _.filter(individual.surveysCompleted, function(o) { return o.company.type===self.ABIBAO_CONST_ENTITY_TYPE_ABIBAO; });
            individual.surveysCompleted = _.filter(individual.surveysCompleted, function(o) { return o.company.type!==self.ABIBAO_CONST_ENTITY_TYPE_ABIBAO; });
            // repack abibaoCompleted
            individual.abibaoCompleted = _.map(individual.abibaoCompleted, function(o) {
              return o.urn;
            });
            // repack abibaoInProgress
            _.map(individual.abibaoInProgress, function(o) {
              delete o.company;
              delete o.charity;
              delete o.campaign;
            });
            // remove currentCharity if id=="none"
            if ( self.getIDfromURN(individual.currentCharity.urn)==="none" ) {
              delete individual.currentCharity;
            }
            // end of command
            self.debug.query(CURRENT_NAME, quid);
            return resolve(individual);
          })
          .catch(function(error) {
            return reject(error);
          });
          break;
        case self.ABIBAO_CONST_USER_SCOPE_ADMINISTRATOR:
          return reject( new Error("Scope administrator is unauthorized") );
        default:
          return reject( new Error("Scope is unauthorized") );
      }
    } catch (e) {
      reject(e);
    }
  });

};