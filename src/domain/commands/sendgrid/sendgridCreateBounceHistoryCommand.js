'use strict'

var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var Promise = require('bluebird')
var eraro = require('eraro')
var Joi = require('joi')
var _ = require('lodash')
var uuid = require('node-uuid')
var path = require('path')

var _eraro = eraro({
  package: 'abibao.domain.command',
  msgmap: {
    'unit_test': 'This is the first TDD error message',
    'joi_validation_payload': '[<%=uuid%>][<%=type%>][<%=name%>] payload validation failed',
    'database_replace': '[<%=uuid%>][<%=type%>][<%=name%>] an error occured during the replace process',
    'joi_validation_result': '[<%=uuid%>][<%=type%>][<%=name%>] result validation failed'
  },
  override: true
})

var validate = Promise.promisify(Joi.validate)
var payloadSchema = Joi.object().keys({
  apiKey: Joi.string(),
  email: Joi.string().email().required()
})
var resultItemSchema = Joi.object().keys({
  id: Joi.string().required(),
  email: Joi.string().email().required(),
  created: Joi.number().integer().required(),
  reason: Joi.string().required(),
  status: Joi.string().required()
})
var resultSchema = Joi.object().keys({
  count: Joi.number().integer().min(0).required(),
  data: Joi.array().items(resultItemSchema).required()
})

var r = require('./../../../connections/rethinkdbdash')(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_DATABASES_MYSQSL_SENDGRID'))
var helper = require('./../../../helper')

module.exports = function (payload = {}) {
  var type = helper.getTypeFromFilename(path.basename(__filename))
  var name = helper.getNameFromFilename(path.basename(__filename))
  return new Promise(function (resolve, reject) {
    var result = {}
    // validate payload: succeed
    validate(payload, payloadSchema)
      .then(() => {
        var apiKey = payload.apiKey || nconf.get('ABIBAO_API_GATEWAY_SENDGRID_API_KEY')
        r.http('https://api.sendgrid.com/v3/suppression/bounces/' + payload.email, {
          'header': {
            'Authorization': 'Bearer ' + apiKey
          }
        })
          .run()
          // call api: succeed
          .then((bounces) => {
            result.data = _.map(bounces, (bounce) => {
              bounce.id = bounce.email + '::' + bounce.created
              return bounce
            })
            result.count = result.data.length
            validate(result, resultSchema)
              // validate result: succeed
              .then(() => {
                var promises = []
                _.map(result.data, (item) => {
                  promises.push(r.table('bounces').get(item.id).replace(item))
                })
                Promise.all(promises)
                  .then((resPromises) => {
                    _.map(result.data, (item) => {
                      r.table('bounces').get(item.id).run()
                        .then((bounce) => {
                          bounce.rethinkdb = bounce.id
                          delete bounce.id
                          global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_SENDGRID_CREATE_BOUNCE_WORKING, bounce)
                        }).catch(() => { })
                    })
                    resolve(result)
                  })
                  .catch((error) => {
                    reject(_eraro('database_replace', {uuid: uuid.v4(), type, name, error}))
                  })
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
