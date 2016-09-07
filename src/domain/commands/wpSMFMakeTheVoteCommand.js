'use strict'

var Promise = require('bluebird')
var Hoek = require('hoek')
var Joi = require('joi')

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    try {
      // validate payload
      var schema = Joi.object().keys({
        email: Joi.string().email().required(),
        startup: Joi.number().integer().min(0).required()
      })
      Joi.validate(payload, schema, function (err, value) {
        // bad validation
        if (err) { throw new Error(err) }
        // default
        payload.email = payload.email.toLowerCase()
        payload.points = 1
        payload.converted = false
        // the show must go on!
        self.SmfVotesSQLModel()
          .then(function() {
            // checks email exists in abibao?
            return self.execute('query', 'individualFilterQuery', {email: payload.email})
          })
          .then(function (individuals) {
            if (individuals.length===1) {
              payload.points = 3
              payload.converted = true
              var individual = individuals[0]
              payload.charity_id = self.getIDfromURN(individual.urnCharity)
              return self.execute('query', 'entityReadQuery', individual.urnCharity)
                .then(function(entity) {
                  payload.charity_name = entity.name
                  // checks email exists in smf_votes?
                  return self.knex('smf_votes').where({email:payload.email})
                })
            } else {
              // checks email exists in smf_votes?
              return self.knex('smf_votes').where({email:payload.email})
            }
          })
          .then(function(rows) {
            if (rows.length>0) {
              return reject('Email already exists in database.')
            } else {
              // checks startup exists ?
              return self.execute('query', 'wpSMFStartupReadQuery', payload.startup)
            }
          })
          .then(function(startup) {
            // all ok we insert the new entry
            var data = {
              email: payload.email,
              startup_id: payload.startup,
              startup_name: startup.title,
              charity_id: payload.charity_id,
              charity_name: payload.charity_name,
              converted: payload.converted,
              points: payload.points
            }
            return self.knex('smf_votes').insert(data)
          })
          .then(function () {
            // return the entry for the specif email in payload
            return self.knex('smf_votes').where({email:payload.email})
          })
          .then(function (vote) {
            resolve(vote)
          })
          .catch(function (error) {
            reject(error)
          })
      })
    } catch (e) {
      reject(e)
    }
  })
}
