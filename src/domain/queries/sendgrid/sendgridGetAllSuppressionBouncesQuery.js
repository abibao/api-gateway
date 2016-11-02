'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var Promise = require('bluebird')
var Eraro = require('eraro')
var Joi = require('joi')
var uuid = require('node-uuid')
var _ = require('lodash')

var eraro = Eraro({
  package: 'abibao.domain.command',
  msgmap: {
    'unit_test': 'This is the first TDD error message',
    'joi_validation_payload': '[<%=uuid%>][<%=type%>][<%=name%>] payload validation failed',
    'bad_sendgrid_api_key': '[<%=uuid%>][<%=type%>][<%=name%>] sendgrid api_key validation failed',
    'joi_validation_result': '[<%=uuid%>][<%=type%>][<%=name%>] result validation failed'
  },
  override: true
})
var validate = Promise.promisify(Joi.validate)
var r = require('./../../../connections/thinky').r

var payloadSchema = Joi.object().keys({
  apiKey: Joi.string()
})
var resultItemSchema = Joi.object().keys({
  id: Joi.string().required(),
  created: Joi.date().timestamp().required(),
  email: Joi.string().email().required(),
  reason: Joi.string().required(),
  status: Joi.string().required()
})
var resultSchema = Joi.object().keys({
  count: Joi.number().integer().min(0).required(),
  data: Joi.array().items(resultItemSchema).required()
})

module.exports = function (payload = {}) {
  var type = 'Query'
  var name = 'SendgridGetAllSuppressionBouncesQuery'
  return new Promise(function (resolve, reject) {
    var result = {}
    validate(payload, payloadSchema)
      // validate payload: succeed
      .then(() => {
        var apiKey = payload.apiKey || nconf.get('ABIBAO_API_GATEWAY_SENDGRID_API_KEY')
        r.http('https://api.sendgrid.com/v3/suppression/bounces', {
          'header': {
            'Authorization': 'Bearer ' + apiKey
          }
        })
          .orderBy(r.desc('created'))
          // call api to have all bounces: succeed
          .then((data) => {
            result.count = data.length
            result.data = _.map(data, (item) => {
              item.id = data.email + '_' + data.created
              return item
            })
            validate(result, resultSchema)
              .then(() => {
                resolve(result)
              })
              // validate result: failed
              .catch((error) => {
                reject(eraro('joi_validation_result', {uuid: uuid.v4(), type, name, error}))
              })
          })
          // call api to have all bounces: failed
          .catch((error) => {
            reject(eraro('bad_sendgrid_api_key', {uuid: uuid.v4(), type, name, error}))
          })
      })
      // validate payload: failed
      .catch((error) => {
        reject(eraro('joi_validation_payload', {uuid: uuid.v4(), type, name, error}))
      })
  })
}
