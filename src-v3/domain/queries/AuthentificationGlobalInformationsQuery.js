'use strict'

// libraries
const Promise = require('bluebird')

class AuthentificationGlobalInformationsQuery {
  constructor (domain) {
    this.type = 'query'
    this.name = 'authentification-global-informations-query'
    this.nconf = domain.nconf
  }
  handler (token) {
    return new Promise((resolve) => {
      resolve({token})
    })
  }
}

module.exports = AuthentificationGlobalInformationsQuery

/**
var Promise = require('bluebird')

var Hoek = require('hoek')
var _ = require('lodash')
var waterfall = require('async').waterfall
var map = require('async').map

var waterIndividual = function (waterfallResults, callback) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  self.execute('query', 'individualReadQuery', waterfallResults.credentials.urn)
    .then(function (individual) {
      waterfallResults.individual = individual
      callback(null, waterfallResults)
    })
    .catch(callback)
}

var waterCurrentCharity = function (waterfallResults, callback) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  self.execute('query', 'entityReadQuery', waterfallResults.individual.urnCharity)
    .then(function (entity) {
      waterfallResults.currentCharity = entity
      callback(null, waterfallResults)
    })
    .catch(callback)
}

var waterCharitiesHistory = function (waterfallResults, callback) {
  waterfallResults.charitiesHistory = []
  callback(null, waterfallResults)
}

var waterIndividualSurveys = function (waterfallResults, callback) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  self.execute('query', 'surveyFilterQuery', {'individual': waterfallResults.credentials.id})
    .then(function (surveys) {
      map(surveys, function (survey, next) {
        survey.nbAnswers = (_.isUndefined(survey.answers) === false) ? _.keys(survey.answers).length : 0
        self.execute('query', 'campaignItemFilterQuery', {campaign: self.getIDfromURN(survey.urnCampaign)})
          .then(function (campaignItems) {
            survey.nbQuestions = campaignItems.length
          })
          .then(function () {
            return self.execute('query', 'entityReadQuery', survey.urnCompany)
          })
          .then(function (company) {
            survey.companyType = company.type
          })
          .then(function () {
            return self.execute('query', 'campaignReadQuery', survey.urnCampaign)
          })
          .then(function (campaign) {
            survey.position = campaign.position
            survey.name = campaign.name
            next()
          })
          .catch(next)
      }, function (err) {
        if (err) { return callback(err) }
        waterfallResults.surveysCompleted = _.orderBy(_.filter(surveys, function (o) { return o.complete === true && o.companyType !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_ENTITY_TYPE_ABIBAO }), ['position', 'createdAt'], ['asc', 'asc'])
        waterfallResults.surveysInProgress = _.orderBy(_.filter(surveys, function (o) { return o.complete === false && o.companyType !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_ENTITY_TYPE_ABIBAO }), ['position', 'createdAt'], ['asc', 'asc'])
        waterfallResults.abibaoCompleted = _.orderBy(_.filter(surveys, function (o) { return o.complete === true && o.companyType === global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_ENTITY_TYPE_ABIBAO }), ['position', 'createdAt'], ['asc', 'asc'])
        waterfallResults.abibaoInProgress = _.orderBy(_.filter(surveys, function (o) { return o.complete === false && o.companyType === global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_ENTITY_TYPE_ABIBAO }), ['position', 'createdAt'], ['asc', 'asc'])
        callback(null, waterfallResults)
      })
    })
    .catch(callback)
}

var abibaoCompletedHandler = function (values) {
  return _.map(values, function (item) {
    return {
      urn: item.urn,
      name: item.name,
      modifiedAt: item.modifiedAt
    }
  })
}

var abibaoInProgressHandler = function (values) {
  return _.map(values, function (item) {
    return {
      urn: item.urn,
      name: item.name,
      urnCampaign: item.urnCampaign,
      position: item.position,
      answers: item.answers || {},
      nbAnswers: item.nbAnswers,
      nbQuestions: item.nbQuestions,
      screenWelcomeContent: item.screenWelcomeContent || '',
      screenThankYouContent: item.screenThankYouContent || '',
      modifiedAt: item.modifiedAt,
      complete: item.complete
    }
  })
}

var surveysInProgressHandler = function (values) {
  return _.map(values, function (item) {
    return {
      urn: item.urn,
      name: item.name,
      urnCampaign: item.urnCampaign,
      position: item.position,
      answers: item.answers || {},
      nbAnswers: item.nbAnswers,
      nbQuestions: item.nbQuestions,
      screenWelcomeContent: item.screenWelcomeContent || '',
      screenThankYouContent: item.screenThankYouContent || '',
      modifiedAt: item.modifiedAt,
      complete: item.complete
    }
  })
}

var surveysCompletedHandler = function (values) {
  return _.map(values, function (item) {
    return {
      urn: item.urn,
      name: item.name,
      modifiedAt: item.modifiedAt
    }
  })
}

module.exports = function (credentials) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    if (_.isUndefined(credentials.action)) { return reject(new Error('Action is undefined')) }
    if (credentials.action !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_AUTH_ME) { return reject(new Error('Action is unauthorized')) }
    if (credentials.scope !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_USER_SCOPE_INDIVIDUAL) { return reject(new Error('Scope is unauthorized')) }
    credentials.id = self.getIDfromURN(credentials.urn)

    waterfall([
      function (callback) {
        callback(null, {credentials})
      },
      waterIndividual,
      waterCurrentCharity,
      waterCharitiesHistory,
      waterIndividualSurveys
    ], function (error, waterfallResults) {
      if (error) { return reject(error) }
      // construt the final result
      var finalResult = {
        urn: waterfallResults.individual.urn,
        email: waterfallResults.individual.email,
        charitiesHistory: waterfallResults.charitiesHistory,
        abibaoCompleted: abibaoCompletedHandler(waterfallResults.abibaoCompleted),
        abibaoInProgress: abibaoInProgressHandler(waterfallResults.abibaoInProgress),
        surveysInProgress: surveysInProgressHandler(waterfallResults.surveysInProgress),
        surveysCompleted: surveysCompletedHandler(waterfallResults.surveysCompleted),
        currentCharity: (waterfallResults.currentCharity.type === 'none') ? '' : waterfallResults.currentCharity.urn
      }
      resolve(finalResult)
    })
  })
}
**/
