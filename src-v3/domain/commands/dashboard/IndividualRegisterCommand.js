'use strict'

const Promise = require('bluebird')
const Joi = require('joi')
const validate = Promise.promisify(Joi.validate)

class IndividualRegisterCommand {
  constructor (domain) {
    this.type = 'command'
    this.name = 'individual-register-command'
    this.nconf = domain.nconf
    this.r = domain.databases.r
    this.domain = domain
  }
  handler (payload) {
    const database = this.nconf.get('ABIBAO_API_GATEWAY_DATABASES_RETHINKDB_MVP')
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password1: Joi.string().required(),
      password2: Joi.string().required(),
      entity: Joi.string(),
      survey: Joi.string(),
      source: Joi.string()
    })
    return new Promise((resolve, reject) => {
      // validate payload
      validate(payload, schema)
        .then((result) => {
          if (payload.password1 !== payload.password2) {
            throw new Error('Passwords verication failed')
          }
          // find individual by email
          payload.email = payload.email.toLowerCase()
          return this.r.db(database).table('individuals').filter({email: payload.email}).run()
        })
        .then((individuals) => {
          if (individuals.length > 0) {
            throw new Error('Email already exists in database')
          } else {
            // entity ?
            if (payload.entity) {
              payload.charity = this.domain.getIDfromURN(payload.entity)
              payload.hasRegisteredEntity = payload.charity
              delete payload.entity
            }
            // survey ?
            if (payload.survey) {
              payload.hasRegisteredSurvey = this.domain.getIDfromURN(payload.survey)
              delete payload.survey
            }
            // source ?
            if (payload.source) {
              payload.hasRegisteredSource = payload.source
              delete payload.source
            }
            return payload
          }
        })
        .then((payload) => {
          payload.password = payload.password1
          delete payload.password1
          delete payload.password2
          payload = this.domain.IndividualModel.create(payload)
          return this.r.db(database).table('individuals').insert(payload).run()
        })
        .then(() => {
          return this.r.db(database).table('individuals').filter({email: payload.email}).run()
        })
        .then((individuals) => {
          if (individuals.length === 0) {
            throw new Error('Email not found in database')
          } else {
            // ... post on slack with bus
            const body = {
              'username': 'IndividualRegisterCommand',
              'text': '[' + new Date() + '] - [' + individuals[0].email + '] has just registered into abibao'
            }
            const webhook = this.nconf.get('ABIBAO_API_GATEWAY_SLACK_WEBHOOK')
            this.domain.WebhookSlackCommand.bus.emit('execute', body, webhook)
            // ... normal resolve
            resolve(this.domain.IndividualModel.transform(individuals[0]))
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

module.exports = IndividualRegisterCommand

/**

////////////////////////////
// ... update smf vote
////////////////////////////
global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_SMF_UPDATE_VOTE, individual)

////////////////////////////
// ... compute user in mysql
////////////////////////////
global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_ANALYTICS_COMPUTE_USER, individual)

////////////////////////////
// auto affect survey ?
////////////////////////////
if (self.getIDfromURN(individual.urnRegisteredSurvey) !== 'none') {
  self.execute('command', 'individualCreateSurveyCommand', {
    campaign: individual.urnRegisteredSurvey,
    individual: individual.urn,
    charity: individual.urnCharity
  }).then(() => {
    resolve(individual)
  }).catch(reject)
} else {
  resolve(individual)
}
})

**/
