"use strict";

var Promise = require("bluebird");
var uuid = require("node-uuid");
var _ = require("lodash");

var CURRENT_NAME = "IndividualSurveyAnswerCommand";

module.exports = function(payload) {

  var self = this;
  
  return new Promise(function(resolve, reject) {
    try {
      var quid = uuid.v1();
      var waterfall = {};
      waterfall.payload = payload;
      return self.surveyReadQuery(payload.survey).then(function(survey) {
        waterfall.survey = survey;
        if ( payload.credentials.urn!== waterfall.survey.urnIndividual ) { return reject("Individual control failed"); }
        return self.campaignItemFilterQuery({campaign:survey.campaign}).then(function(items) {
          waterfall.items = items;
          if ( _.isUndefined(_.find(waterfall.items, {"label":payload.label })) ) { return reject("Answer control failed"); }
          // add answer
          if ( _.isUndefined(waterfall.survey.answers) ) { waterfall.survey.answers = {}; }
          waterfall.survey.answers[payload.label] = payload.answer;
          waterfall.survey.complete = _.keys(waterfall.survey.answers).length===waterfall.items.length;
          return self.surveyUpdateCommand(waterfall.survey).then(function(updated) {
            self.debug.query(CURRENT_NAME, quid);
            resolve(updated);
          });
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
