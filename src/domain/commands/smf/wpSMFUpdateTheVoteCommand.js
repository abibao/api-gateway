'use strict'

var Promise = require('bluebird')
var Joi = require('joi')

module.exports = function (payload) {
  return new Promise(function (resolve, reject) {
    var self = global.ABIBAO.services.domain
    var database = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_DATABASES_MYSQSL_MVP')
    // validate payload
    var schema = Joi.object().keys({
      email: Joi.string().email().required()
    })
    var vote = {}
    Joi.validate(payload, schema, function (err) {
      // bad validation
      if (err) { throw new Error(err) }
      // default
      payload.email = payload.email.toLowerCase()
      self.knex(database + '.smf_votes')
        .where({email: payload.email})
        .then(function (result) {
          if (result.length === 1) {
            vote = result[0]
            return vote
          } else {
            return false
          }
        })
        .then(function (result) {
          if (result !== false) {
            return self.knex(database + '.smf_votes').where({email: payload.email}).delete()
          } else {
            return false
          }
        })
        .then(function (result) {
          if (result !== false) {
            var message = {
              email: payload.email,
              node: vote['startup_id'],
              startup: vote['startup_id']
            }
            return self.execute('command,', 'wpSMFMakeTheVoteCommand', message)
          } else {
            return false
          }
        })
        .then(resolve)
        .catch(reject)
    })
  })
}
