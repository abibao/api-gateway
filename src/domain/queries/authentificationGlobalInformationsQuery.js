'use strict'

const Promise = require('bluebird')
const Hoek = require('hoek')
const _ = require('lodash')
const waterfall = require('async').waterfall
const map = require('async').map
const errors = require('feathers-errors')

const waterIndividual = function (waterfallResults, callback) {
  const self = Hoek.clone(global.ABIBAO.services.domain)
  self.execute('query', 'getIndividualDetailsQuery', {query: {urn: waterfallResults.credentials.urn}})
    .then(function (individual) {
      waterfallResults.individual = individual
      callback(null, waterfallResults)
    })
    .catch(callback)
}

const waterCurrentCharity = function (waterfallResults, callback) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  self.execute('query', 'getEntityDetailsQuery', {query: {urn: waterfallResults.individual.charity}})
    .then(function (entity) {
      waterfallResults.currentCharity = entity
      callback(null, waterfallResults)
    })
    .catch(callback)
}

const waterCharitiesHistory = function (waterfallResults, callback) {
  waterfallResults.charitiesHistory = []
  callback(null, waterfallResults)
}

const waterIndividualSurveys = function (waterfallResults, callback) {
  const self = Hoek.clone(global.ABIBAO.services.domain)
  self.execute('query', 'findSurveysQuery', {$limit: 0, query: {individual: waterfallResults.credentials.urn}})
    .then(function (surveys) {
      surveys = Hoek.clone(surveys.data)
      map(surveys, function (survey, next) {
        survey.nbAnswers = (_.isUndefined(survey.answers) === false) ? _.keys(survey.answers).length : 0
        self.execute('query', 'findCampaignItemsQuery', {$limit: 0, query: {campaign: survey.campaign}})
          .then(function (campaignItems) {
            survey.nbQuestions = campaignItems.total
          })
          .then(function () {
            return self.execute('query', 'getEntityDetailsQuery', {query: {urn: survey.company}})
          })
          .then(function (company) {
            survey.companyType = company.type
          })
          .then(function () {
            return self.execute('query', 'getCampaignDetailsQuery', {query: {urn: survey.campaign}})
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

const abibaoCompletedHandler = function (values) {
  return _.map(values, function (item) {
    return {
      id: item.id,
      name: item.name,
      modifiedAt: item.modifiedAt
    }
  })
}

const abibaoInProgressHandler = function (values) {
  return _.map(values, function (item) {
    return {
      id: item.id,
      name: item.name,
      campaign: item.campaign,
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

const surveysInProgressHandler = function (values) {
  return _.map(values, function (item) {
    return {
      id: item.id,
      name: item.name,
      campaign: item.campaign,
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

const surveysCompletedHandler = function (values) {
  return _.map(values, function (item) {
    return {
      id: item.id,
      name: item.name,
      modifiedAt: item.modifiedAt
    }
  })
}

module.exports = function (credentials) {
  return new Promise(function (resolve, reject) {
    try {
      if (_.isUndefined(credentials.action)) { return reject(new Error('Action is undefined')) }
      if (credentials.action !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_AUTH_ME) { return reject(new Error('Action is unauthorized')) }
      if (credentials.scope !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_USER_SCOPE_INDIVIDUAL) { return reject(new Error('Scope is unauthorized')) }

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
          urn: waterfallResults.individual.id,
          email: waterfallResults.individual.email,
          charitiesHistory: waterfallResults.charitiesHistory,
          abibaoCompleted: abibaoCompletedHandler(waterfallResults.abibaoCompleted),
          abibaoInProgress: abibaoInProgressHandler(waterfallResults.abibaoInProgress),
          surveysInProgress: surveysInProgressHandler(waterfallResults.surveysInProgress),
          surveysCompleted: surveysCompletedHandler(waterfallResults.surveysCompleted),
          currentCharity: (waterfallResults.currentCharity.type === 'none') ? '' : waterfallResults.currentCharity.id
        }
        resolve(finalResult)
      })
    } catch (error) {
      if (error.type === 'FeathersError') {
        reject(error)
      } else {
        reject(new errors.GeneralError(error))
      }
    }
  })
}
