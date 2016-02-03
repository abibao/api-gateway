"use strict";

var _ = require('lodash');

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'IndividualSurveyAnswerCommand';

module.exports = function(credentials, payload, callback) {

  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    var waterfall = {};
    
    self.SystemReadDataQuery(self.IndividualModel, credentials.id).then(function(individual) {
      waterfall.individual = {
        id: individual.id,
        charity: individual.charity
      };
      return self.SystemReadDataQuery(self.SurveyModel, payload.survey).then(function(survey) {
        waterfall.survey = survey;
        return self.SystemFindDataQuery(self.CampaignItemModel, {campaign:survey.campaign}).then(function(items) {
          waterfall.items = items;
          // controls
          if ( waterfall.individual.charity!==waterfall.survey.charity ) return callback('Charity control failed', null);
          if ( waterfall.individual.id!==waterfall.survey.individual ) return callback('Individual control failed', null);
          if ( _.find(waterfall.items, {'label':payload.label })===undefined ) return callback('Campaign control failed', null);
          // add answer
          if ( waterfall.survey.answers===undefined ) waterfall.survey.answers = {};
          waterfall.survey.answers[payload.label] = payload.answer;
          waterfall.survey.complete = _.keys(waterfall.survey.answers).length===waterfall.items.length;
          return self.SystemUpdateDataCommand(self.SurveyModel, waterfall.survey).then(function(saved) {
            callback(null, saved);
          });
        });
      });
    })
    .catch(function(error) {
      callback(error, null);
    });

  } catch (e) {
    callback(e, null);
  }
  
};
