'use strict'

var Promise = require('bluebird')

module.exports = function (payload) {
  var self = this

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
        self.execute('command', 'individualCreateCommand', payload).then(function (individual) {
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
