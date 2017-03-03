'use strict'

var Promise = require('bluebird')
var eraro = require('eraro')
var Joi = require('joi')
var uuid = require('node-uuid')
var path = require('path')

var _eraro = eraro({
  package: 'abibao.domain.command',
  msgmap: {
    'unit_test': 'This is the first TDD error message',
    'joi_validation_payload': '[<%=uuid%>][<%=type%>][<%=name%>] payload validation failed',
    'knex_error': '[<%=uuid%>][<%=type%>][<%=name%>] an error occured during knex initialize process',
    'database_replace': '[<%=uuid%>][<%=type%>][<%=name%>] an error occured during the replace process',
    'joi_validation_result': '[<%=uuid%>][<%=type%>][<%=name%>] result validation failed'
  },
  override: true
})

var validate = Promise.promisify(Joi.validate)
var payloadSchema = Joi.object().keys({
  rethinkdb: Joi.string().required(),
  email: Joi.string().email().required(),
  created: Joi.number().integer().required(),
  reason: Joi.string().required(),
  status: Joi.string().required()
})

var helper = require('./../../../helper')

module.exports = function (payload = {}) {
  var type = helper.getTypeFromFilename(path.basename(__filename))
  var name = helper.getNameFromFilename(path.basename(__filename))
  return new Promise(function (resolve, reject) {
    var result = {}
    // validate payload: succeed
    validate(payload, payloadSchema)
      .then(() => {
        global.ABIBAO.services.domain.knex('bounces')
          .where({rethinkdb: payload.rethinkdb})
          .then((result) => {
            if (result.length === 0) {
              return global.ABIBAO.services.domain.knex('bounces').insert(payload)
            } else {
              return global.ABIBAO.services.domain.knex('bounces').where({rethinkdb: payload.rethinkdb}).update(payload)
            }
          })
          .then(() => {
            resolve(result)
          })
          .catch(reject)
      })
      // validate payload: failed
      .catch((error) => {
        reject(_eraro('joi_validation_payload', {uuid: uuid.v4(), type, name, error}))
      })
  })
}
