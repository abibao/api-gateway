'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')
var nconf = global.ABIBAO.nconf

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)

  return new Promise(function (resolve, reject) {
    try {
      // password confirmation
      if (payload.password1 !== payload.password2) {
        throw new Error('invalid password confimation')
      }
      payload.password = payload.password1
      delete payload.password1
      delete payload.password2
      // email already exists ?
      self.execute('query', 'individualFilterQuery', {email: payload.email}).then(function (individuals) {
        if (individuals.length > 0) {
          throw new Error('Email already exists in database')
        }
        // create individual
        if (payload.entity) {
          payload.charity = self.getIDfromURN(payload.entity)
          delete payload.entity
        }
        self.execute('command', 'individualCreateCommand', payload).then(function (individual) {
          // informations posted on slack
          global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_WEBHOOK_SLACK, {
            'channel': '#cast-members-only',
            'username': 'IndividualRegisterCommand',
            'text': '[' + new Date() + '] - [' + individual.email + '] has just registered into abibao',
            'webhook': nconf.get('ABIBAO_API_GATEWAY_SLACK_WEBHOOK')
          })
          resolve(individual)
        })
      })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}
