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
    const database = this.nconf.get('ABIBAO_API_GATEWAY_DATABASES_RETHINKDB_MVP')
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
              abibao: true,
              answers: {}
            }
            // create the new survey
            data = this.domain.SurveyModel.create(data)
            return this.r.db(database).table('surveys').insert(data).run()
          }
        })
        .then(() => {
          // ... post on slack with bus
          const body = {
            'username': 'IndividualCreateAbibaoSurveyCommand',
            'text': '[' + new Date() + '] - [' + waterfall.individual.email + '] can access abibao surveys (' + waterfall.campaign.position + ')'
          }
          const webhook = this.nconf.get('ABIBAO_API_GATEWAY_SLACK_WEBHOOK')
          this.domain.WebhookSlackCommand.bus.emit('execute', body, webhook)
          // ... normal resolve
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

module.exports = IndividualCreateAbibaoSurveyCommand
