'use strict'

var Promise = require('bluebird')
var Hoek = require('hoek')

var nconf = global.ABIBAO.nconf

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
        resolve(individual)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
