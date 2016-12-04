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
    this.individualModel = domain.IndividualModel
    this.domain = domain
  }
  handler (payload) {
    return new Promise((resolve, reject) => {
      const database = this.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
      const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password1: Joi.string().required(),
        password2: Joi.string().required(),
        entity: Joi.string(),
        survey: Joi.string(),
        source: Joi.string()
      })
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
          resolve({test: true})
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

module.exports = IndividualRegisterCommand

/**
module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    // email to lowercase
    payload.email = payload.email.toLowerCase()
    // password confirmation
    if (payload.password1 !== payload.password2) {
      throw new Error('invalid password confimation')
    }
    payload.password = payload.password1
    delete payload.password1
    delete payload.password2
    // email already exists ?
    self.execute('query', 'individualFilterQuery', {email: payload.email})
      .then(function (individuals) {
        if (individuals.length > 0) {
          throw new Error('Email already exists in database')
        }
        // entity ?
        if (payload.entity) {
          payload.charity = self.getIDfromURN(payload.entity)
          payload.hasRegisteredEntity = payload.charity
          delete payload.entity
        }
        // survey ?
        if (payload.survey) {
          payload.hasRegisteredSurvey = self.getIDfromURN(payload.survey)
          delete payload.survey
        }
        // source ?
        if (payload.source) {
          payload.hasRegisteredSource = payload.source
          delete payload.source
        }
        return payload
      })
      .then(function (payload) {
        return self.execute('command', 'individualCreateCommand', payload)
      })
      .then(function (individual) {
        // events on bus
        // ... post informations on slack
        global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_WEBHOOK_SLACK, {
          'username': 'IndividualRegisterCommand',
          'text': '[' + new Date() + '] - [' + individual.email + '] has just registered into abibao',
          'webhook': nconf.get('ABIBAO_API_GATEWAY_SLACK_WEBHOOK')
        })
        // ... update smf vote
        global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_SMF_UPDATE_VOTE, individual)
        // ... compute user in mysql
        global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_ANALYTICS_COMPUTE_USER, individual)
        // auto affect survey ?
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
      .catch(function (error) {
        reject(error)
      })
  })
}
**/
