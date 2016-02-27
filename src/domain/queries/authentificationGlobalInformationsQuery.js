"use strict";

var Promise = require("bluebird");
var _ = require("lodash");
var uuid = require("node-uuid");

var CURRENT_NAME = "AuthentificationGlobalInformationsQuery";
 
module.exports = function(credentials) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    var quid = uuid.v1();
    self.debug.query("");
    try {
      if ( _.isUndefined(credentials.action) ) { return reject("Action is undefined"); }
      if ( credentials.action!==self.ABIBAO_CONST_TOKEN_AUTH_ME ) return reject("Action is unauthorized");
      switch (credentials.scope) {
        case self.ABIBAO_CONST_USER_SCOPE_INDIVIDUAL:
          credentials.id = self.getIDfromURN(credentials.urn);
          self.r.table("individuals").get(credentials.id).merge(function(individual) {
            return {
              current_charity: self.r.table("entities").get(individual("charity")).merge(function(entity) {
                return {
                  urn: entity("id")
                };
              }).pluck("urn","name","contact","icon","avatar","picture"),
              charities_history: self.r.table("surveys").filter({"individual":individual("id")})("charity").distinct().map(function(val) {
                return self.r.table("entities").get(val).merge(function(charity) {
                  return {
                    urn: charity("id"),
                    me: {
                      total_surveys_completed: self.r.table("surveys").filter({"individual":individual("id"),"charity":charity("id"),"complete":true}).coerceTo("array").count(),
                      total_price_collected: self.r.table("surveys").filter({"individual":individual("id"),"charity":charity("id"),"complete":true}).coerceTo("array").eqJoin("campaign",self.r.table("campaigns")).zip().sum("price"),
                    },
                    total_individuals: self.r.table("surveys").filter({"charity":charity("id")}).coerceTo("array").count(),
                    total_surveys_completed: self.r.table("surveys").filter({"charity":charity("id"),"complete":true}).coerceTo("array").count(),
                    total_price_collected: self.r.table("surveys").filter({"charity":charity("id"),"complete":true}).coerceTo("array").eqJoin("campaign",self.r.table("campaigns")).zip().sum("price"),
                  };
                }).pluck("urn","name","me", "total_individuals","total_price_collected","total_surveys_completed");
              }),
              surveys_completed: self.r.table("surveys").filter({"individual":individual("id"),"complete":true}).coerceTo("array").merge(function(survey) {
                return {
                  urn: survey("id")
                };
              }).pluck("urn"),
              surveys_in_progress: self.r.table("surveys").filter({"individual":individual("id"),"complete":false}).coerceTo("array").merge(function(survey) {
                return {
                  urn: survey("id"),
                  campaign: self.r.table("campaigns").get(survey("campaign")).merge(function(campaign) {
                    return {
                      urn: survey("id")
                    };
                  }).pluck("urn","name","price","currency"),
                  company: self.r.table("entities").get(survey("company"))("name"),
                  charity: self.r.table("entities").get(survey("charity"))("name"),
                  nb_items: self.r.table("campaigns_items").filter({"campaign":survey("campaign")}).count(),
                  nb_answers: ( _.isUndefined(survey.answers)===false ) ? survey("answers").keys().count() : 0,
                };
              }).pluck("urn","campaign","company","charity","modifiedAt","nb_items","nb_answers","answers","complete")
            };
          }).pluck("email","charities_history","current_charity","surveys_in_progress","surveys_completed")
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
            // charities_history: calculate URN
            _.map(individual.charities_history, function(item) {
              item.urn = self.getURNfromID(item.urn, "entity");
            });
            // charities_history: calculate URN
            individual.current_charity.urn = self.getURNfromID(individual.current_charity.urn, "entity");
            // surveys_in_progress:  calculate URN
            _.map(individual.surveys_in_progress, function(item) {
              item.urn = self.getURNfromID(item.urn, "survey");
              item.campaign.urn = self.getURNfromID(item.urn, "campaign");
            });
            // surveys_completed:  calculate URN
            _.map(individual.surveys_completed, function(item) {
              item.urn = self.getURNfromID(item.urn, "survey");
            });
            // end of command
            self.debug.query(CURRENT_NAME, quid);
            return resolve(individual);
          })
          .catch(function(error) {
            self.logger.error(CURRENT_NAME);
            return reject(error);
          });
          break;
        case self.ABIBAO_CONST_USER_SCOPE_ADMINISTRATOR:
          self.logger.error(CURRENT_NAME);
          return reject("Scope administrator is unauthorized");
        default:
          self.logger.error(CURRENT_NAME);
          return reject("Scope is unauthorized");
      }
    } catch (e) {
      self.logger.error(CURRENT_NAME);
      reject(e);
    }
  });

};