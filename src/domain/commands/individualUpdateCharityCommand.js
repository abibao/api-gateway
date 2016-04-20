'use strict'

var Promise = require('bluebird')
var _ = require('lodash')

module.exports = function (payload) {
  var self = this

  return new Promise(function (resolve, reject) {
    try {
      if (_.isUndefined(payload.credentials.action)) { return reject(new Error('Action is undefined')) }
      if (payload.credentials.action !== self.ABIBAO_CONST_TOKEN_AUTH_ME) { return reject(new Error('Action is unauthorized')) }
      self.execute('query', 'entityReadQuery', payload.charity).then(function (charity) {
        if (charity.type !== self.ABIBAO_CONST_ENTITY_TYPE_CHARITY) { return reject(new Error('This is not a Charity')) }
        return self.execute('query', 'individualReadQuery', payload.credentials.urn).then(function (individual) {
          if (individual.urnCharity === charity.urn) { return reject(new Error('Charity already affected')) }
          return self.execute('command', 'individualUpdateCommand', { urn: payload.credentials.urn, charity: self.getIDfromURN(charity.urn) }).then(function (individual) {
            resolve(individual)
          })
        })
      }).catch(function (error) {
        reject(error)
      })
    } catch (e) {
      reject(e)
    }
  })
}
