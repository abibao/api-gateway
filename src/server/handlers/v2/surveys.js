'use strict'

const Boom = require('boom')
const Promise = require('bluebird')

module.exports.getSurveyDetailsQuery = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  jsonp: 'callback',
  handler (request, reply) {
    // query in abibao!
    global.ABIBAO.services.domain.databases.mvp.Survey.findById(request.params.urn)
      .then((survey) => {
        let queries = {
          survey,
          campaign: global.ABIBAO.services.domain.databases.mvp.Campaign.findById(survey.campaign),
          items: global.ABIBAO.services.domain.databases.mvp.CampaignItem.findAll({
            where: {
              campaign: survey.campaign
            },
            include: [{
              model: global.ABIBAO.services.domain.databases.mvp.CampaignItemChoice,
              as: 'choices',
              where: { campaign: survey.campaign }
            }],
            order: 'position ASC'
          }),
          answers: global.ABIBAO.services.domain.databases.mvp.SurveyAnswer.findAll({
            where: {
              survey: survey.id
            }
          })
        }
        return Promise.props(queries).then(function (result) {
          reply({
            answers: {},
            items: [],
            name: result.campaign.name,
            screenThankYouContent: result.campaign.screenThankYouContent || '',
            screenWelcomeContent: result.campaign.screenWelcomeContent || '',
            urn: result.survey.urn,
            createdAt: result.survey.createdAt,
            updatedAt: result.survey.updatedAt
          })
        })
      })
      .catch(function (error) {
        console.log(error)
        reply(Boom.badRequest(error))
      })
  }
}

module.exports.create = {
  auth: false,
  payload: {
    allow: ['application/x-www-form-urlencoded', 'application/json']
  },
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.databases.mvp.Survey.upsert(request.payload)
      .then(function (result) {
        reply(result)
      })
      .catch(function (error) {
        console.log(error)
        reply(Boom.badRequest(error))
      })
  }
}

module.exports.list = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.databases.mvp.Survey.findAndCount({ offset: parseInt(request.query.offset) || 0, limit: parseInt(request.query.limit) || 20 })
      .then(function (result) {
        reply({
          total: result.count,
          offset: parseInt(request.query.offset) || 0,
          limit: parseInt(request.query.limit) || 20,
          data: result.rows
        })
      })
      .catch(function (error) {
        console.log(error)
        reply(Boom.badRequest(error))
      })
  }
}
