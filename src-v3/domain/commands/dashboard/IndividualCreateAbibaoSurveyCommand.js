'use strict'

// libraries
const Promise = require('bluebird')
const Joi = require('joi')
const validate = Promise.promisify(Joi.validate)

class IndividualCreateAbibaoSurveyCommand {
  constructor (domain) {
    this.type = 'command'
    this.name = 'individual-create-abibao-survey-command'
    this.nconf = domain.nconf
    this.r = domain.databases.r
    this.domain = domain
  }
  handler (payload) {
    const database = this.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      position: Joi.number().integer().min(1)
    })
    const waterfall = {}
    return new Promise((resolve, reject) => {
      // validate payload
      validate(payload, schema)
        .then(() => {
          // get entity abibao
          return this.r.db(database).table('entities').filter({type: 'abibao'}).run()
        })
        .then((entities) => {
          // get campaign in position (n)
          waterfall.abibao = entities[0]
          return this.r.db(database).table('campaigns').filter({company: waterfall.abibao.id, position: payload.position}).run()
        })
        .then((campaigns) => {
          if (campaigns.length === 0) {
            resolve()
          } else {
            // get individual by email
            waterfall.campaign = campaigns[0]
            return this.r.db(database).table('individuals').filter({email: payload.email}).run()
          }
        })
        .then((individuals) => {
          if (individuals.length === 0) {
            resolve()
          } else {
            // control if individual has already the survey affected
            waterfall.individual = individuals[0]
            return this.r.db(database).table('surveys').filter({individual: waterfall.individual.id, campaign: waterfall.campaign.id}).run()
          }
        })
        .then((controls) => {
          if (controls.length !== 0) {
            resolve()
          } else {
            // ok so we continue
            var data = {
              campaign: waterfall.campaign.id,
              company: waterfall.campaign.company,
              charity: waterfall.campaign.company,
              individual: waterfall.individual.id,
              complete: false,
              isAbibao: true,
              answers: {}
            }
            // create the new survey
            data = this.domain.SurveyModel.create(data)
            return this.r.db(database).table('surveys').insert(data).run()
          }
        })
        .then(() => {
          resolve()
          // bus: post on slack
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

module.exports = IndividualCreateAbibaoSurveyCommand

/*
module.exports = IndividualCreateAbibaoSurveyCommand
module.exports = function (data) {
  var target = data.target
  var position = data.position
  var email = data.email
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    // get abibao entity
    self.execute('query', 'entityFilterQuery', {type: 'abibao'})
      .then(function (entities) {
        var entity = entities[0]
        entity.id = self.getIDfromURN(entity.urn)
        // get the campaign with the requested position
        return self.execute('query', 'campaignFilterQuery', {company: entity.id, position}).then(function (campaigns) {
          // control is individual as this campaign already affected
          var campaign = campaigns[0]
          return self.execute('query', 'surveyFilterQuery', {individual: self.getIDfromURN(target), campaign: self.getIDfromURN(campaign.urn)})
            .then(function (surveys) {
              if (surveys.length !== 0) { return resolve() }
              // ok so we continue
              var data = {
                campaign: self.getIDfromURN(campaign.urn),
                company: self.getIDfromURN(campaign.urnCompany),
                charity: self.getIDfromURN(campaign.urnCompany),
                individual: self.getIDfromURN(target),
                answers: {}
              }
              // create the new survey
              return self.execute('command', 'surveyCreateCommand', data)
                .then(function () {
                  resolve()
                  // informations posted on slack
                  global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_WEBHOOK_SLACK, {
                    'username': 'IndividualCreateAbibaoSurveyCommand',
                    'text': '[' + new Date() + '] - [' + email + '] can access abibao surveys (' + position + ')',
                    'webhook': nconf.get('ABIBAO_API_GATEWAY_SLACK_WEBHOOK')
                  })
                })
            })
        })
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
*/
