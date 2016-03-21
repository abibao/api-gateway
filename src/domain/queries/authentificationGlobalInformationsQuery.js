"use strict";

var Promise = require("bluebird");
var _ = require("lodash");
var waterfall = require("async").waterfall;
var map = require("async").map;
var uuid = require("node-uuid");

var CURRENT_NAME = "AuthentificationGlobalInformationsQuery";
 
module.exports = function(credentials) {
  
  var self = this;
  
  return new Promise(function(resolve, reject) {
    
    var quid = uuid.v1();
    self.debug.query('%s - %s start', CURRENT_NAME, quid );
    
    try {
      
      if ( _.isUndefined(credentials.action) ) { return reject( new Error("Action is undefined") ); }
      if ( credentials.action!==self.ABIBAO_CONST_TOKEN_AUTH_ME ) { return reject( new Error("Action is unauthorized") ); }
      if ( credentials.scope!==self.ABIBAO_CONST_USER_SCOPE_INDIVIDUAL) { return reject( new Error("Scope is unauthorized") ); }
      
      var waterfallResults = {};
      
      credentials.id = self.getIDfromURN(credentials.urn);
      
      waterfall([
        
        // initialize
        function(callback) {
          callback(null, waterfallResults);
        },
        // individual
        function(results, callback) {
          self.individualReadQuery(credentials.urn).then(function(individual) {
            waterfallResults.individual = individual;
            callback(null, waterfallResults);
          })
          .catch(callback);
        },
        // currentCharity
        function(results, callback) {
          self.entityReadQuery(waterfallResults.individual.urnCharity).then(function(entity) {
            waterfallResults.currentCharity = entity;
            callback(null, waterfallResults);
          })
          .catch(callback);
        },
        // charitiesHistory
        function(results, callback) {
          waterfallResults.charitiesHistory = []; // TODO
          callback(null, waterfallResults);
          /*self.r.table("surveys").filter({"individual":individual("id")})("charity").distinct().map(function(val) {
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
          });*/
        },
        // surveysCompleted / surveysInProgress / abibaoCompleted / abibaoInProgress 
        function(results, callback) {
          self.surveyFilterQuery({"individual":credentials.id}).then(function(surveys) {
            map(surveys, function(survey, next) {
              survey.nbAnswers = ( _.isUndefined(survey.answers)===false ) ? _.keys(survey.answers).length : 0;
              self.campaignItemFilterQuery({campaign:self.getIDfromURN(survey.urnCampaign)}).then(function(campaignItems) {
                survey.nbQuestions = campaignItems.length;
                return self.entityReadQuery(survey.urnCompany).then(function(company) {
                  survey.companyType = company.type;
                  return self.campaignReadQuery(survey.urnCampaign).then(function(campaign) {
                    survey.position = campaign.position;
                    survey.name = campaign.name;
                    next();
                  });
                });
              })
              .catch(next);
            }, function(err, res) {
              if (err) { return reject(err); }
              waterfallResults.surveysCompleted = _.orderBy( _.filter(surveys, function(o) { return o.complete===true && o.companyType!==self.ABIBAO_CONST_ENTITY_TYPE_ABIBAO; }), ["position", "createdAt"], ["asc", "asc"]);
              waterfallResults.surveysInProgress = _.orderBy( _.filter(surveys, function(o) { return o.complete===false && o.companyType!==self.ABIBAO_CONST_ENTITY_TYPE_ABIBAO; }), ["position", "createdAt"], ["asc", "asc"]);
              waterfallResults.abibaoCompleted = _.orderBy( _.filter(surveys, function(o) { return o.complete===true && o.companyType===self.ABIBAO_CONST_ENTITY_TYPE_ABIBAO; }), ["position", "createdAt"], ["asc", "asc"]);
              waterfallResults.abibaoInProgress = _.orderBy( _.filter(surveys, function(o) { return o.complete===false && o.companyType===self.ABIBAO_CONST_ENTITY_TYPE_ABIBAO; }), ["position", "createdAt"], ["asc", "asc"]);
              callback(null, waterfallResults);
            });
          })
          .catch(callback);
        }
        
      ], function(error, result) {
        if (error) { return reject(error); }
        // construt the final result
        var finalResult = {
          urn: waterfallResults.individual.urn,
          email: waterfallResults.individual.email,
          charitiesHistory: waterfallResults.charitiesHistory,
          abibaoCompleted: _.map(waterfallResults.abibaoCompleted, function(item) {
            return {
              urn: item.urn,
              name: item.name,
              modifiedAt: item.modifiedAt
            };
          }),
          abibaoInProgress: _.map(waterfallResults.abibaoInProgress, function(item) {
            return {
              urn: item.urn,
              name: item.name,
              urnCampaign: item.urnCampaign,
              position: item.position,
              answers: item.answers || {},
              nbAnswers: item.nbAnswers,
              nbQuestions: item.nbQuestions,
              screenWelcomeContent: item.screenWelcomeContent || "",
              screenThankYouContent: item.screenThankYouContent || "",
              modifiedAt: item.modifiedAt,
              complete: item.complete
            };
          }),
          surveysInProgress: _.map(waterfallResults.surveysInProgress, function(item) {
            return {
              urn: item.urn,
              name: item.name,
              urnCampaign: item.urnCampaign,
              position: item.position,
              answers: item.answers || {},
              nbAnswers: item.nbAnswers,
              nbQuestions: item.nbQuestions,
              screenWelcomeContent: item.screenWelcomeContent || "",
              screenThankYouContent: item.screenThankYouContent || "",
              modifiedAt: item.modifiedAt,
              complete: item.complete
            };
          }),
          surveysCompleted: _.map(waterfallResults.surveysCompleted, function(item) {
            return {
              urn: item.urn,
              name: item.name,
              modifiedAt: item.modifiedAt
            };
          }),
          currentCharity: (waterfallResults.currentCharity.type==="none") ? "" : waterfallResults.currentCharity.urn
        };
        resolve(finalResult);
      });
      
    } catch (e) {
      reject(e);
    }
  });

};
