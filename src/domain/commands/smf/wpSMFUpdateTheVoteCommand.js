'use strict'

var Promise = require('bluebird')
var Hoek = require('hoek')
var Joi = require('joi')

module.exports = function (payload) {
  return new Promise(function (resolve, reject) {
    var self = Hoek.clone(global.ABIBAO.services.domain)
    var database = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
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
          }
        })
        .then(function () {
          return self.knex(database + '.smf_votes').where({email: payload.email}).delete()
        })
        .then(function () {
          var message = {
            email: payload.email,
            node: vote['startup_id'],
            startup: vote['startup_id']
          }
          return self.execute('command,', 'wpSMFMakeTheVoteCommand', message)
        })
        .then(resolve)
        .catch(reject)
    })
  })
}
