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
    'bad_sendgrid_api_key': '[<%=uuid%>][<%=type%>][<%=name%>] sendgrid api_key validation failed',
    'joi_validation_result': '[<%=uuid%>][<%=type%>][<%=name%>] result validation failed'
  },
  override: true
})

var validate = Promise.promisify(Joi.validate)
var payloadSchema = Joi.object().keys({
  apiKey: Joi.string()
})
var resultSchema = Joi.object().keys({
  count: Joi.number().integer().min(0).required(),
  data: Joi.array().items(Joi.string().email()).required()
})

var helper = require('./../../../helper')

module.exports = function (payload = {}) {
  var type = helper.getTypeFromFilename(path.basename(__filename))
  var name = helper.getNameFromFilename(path.basename(__filename))
  return new Promise(function (resolve, reject) {
    var result = {}
    validate(payload, payloadSchema)
      // validate payload: succeed
      .then(() => {
        var apiKey = payload.apiKey || global.ABIBAO.config('ABIBAO_API_GATEWAY_SENDGRID_API_KEY')
        global.ABIBAO.services.domain.think.r.http('https://api.sendgrid.com/v3/suppression/bounces', {
          'header': {
            'Authorization': 'Bearer ' + apiKey
          }
        })
          .orderBy(global.ABIBAO.services.domain.think.r.desc('created'))
          .map(function (item) {
            return item('email')
          })
          .distinct()
          // call api: succeed
          .then((data) => {
            result.count = data.length
            result.data = data
            validate(result, resultSchema)
              // validate result: succeed
              .then(() => {
                resolve(result)
              })
              // validate result: failed
              .catch((error) => {
                reject(_eraro('joi_validation_result', {uuid: uuid.v4(), type, name, error}))
              })
          })
          // call api: failed
          .catch((error) => {
            reject(_eraro('bad_sendgrid_api_key', {uuid: uuid.v4(), type, name, error}))
          })
      })
      // validate payload: failed
      .catch((error) => {
        reject(_eraro('joi_validation_payload', {uuid: uuid.v4(), type, name, error}))
      })
  })
}
