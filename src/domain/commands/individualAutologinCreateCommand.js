'use strict'

const Promise = require('bluebird')
const Hoek = require('hoek')
var Cryptr = require('cryptr')
var cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
const errors = require('feathers-errors')

module.exports = function (payload) {
  const self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    let individual
    if (!payload) { return reject(new errors.BadRequest('ERROR_BAD_AUTHENTIFICATION_PAYLOAD_NOT_FOUND')) }
    if (!payload.backUrl) { return reject(new errors.BadRequest('ERROR_BAD_AUTHENTIFICATION_BACKURL_NOT_FOUND')) }
    if (!payload.email) { return reject(new errors.BadRequest('ERROR_BAD_AUTHENTIFICATION_EMAIL_NOT_FOUND')) }
    // email to lowercase
    payload.email = payload.email.toLowerCase()
    // email in individuals or not ?
    self.execute('query', 'findIndividualsQuery', { query: { email: payload.email } })
      .then(function (individuals) {
        if (individuals.length === 0) { return reject(new errors.BadRequest('ERROR_BAD_AUTHENTIFICATION_EMAIL_NOT_FOUND')) }
        if (individuals.length > 1) { return reject(new errors.BadRequest('ERROR_BAD_AUTHENTIFICATION_EMAIL_DUPLICATE')) }
        individual = individuals.data[0]
        return individual
      })
      // user in memory or not ?
      .then(function (individual) {
        let roles = []
        roles.push(individual.scope)
        if (individual.scope === 'administrator') roles.push('individual')
        let user = {
          urn: individual.id,
          email: individual.email,
          password: cryptr.encrypt(individual.email),
          roles: roles
        }
        global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_SEND_EMAIL_FOR_AUTOLOGIN_WITH_FINGERPRINT, { user: user, backUrl: payload.backUrl })
        resolve({command: 'individualAutologinCreateCommand', status: 'ok'})
      })
      .catch(function (error) {
        if (error.type === 'FeathersError') {
          reject(error)
        } else {
          reject(new errors.GeneralError(error))
        }
      })
  })
}
