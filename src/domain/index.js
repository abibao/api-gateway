'use strict'

var Promise = require('bluebird')

var _ = require('lodash')
var async = require('async')
var path = require('path')
var fs = require('fs')
var uuid = require('node-uuid')

var internals = {
  constants: {
    ABIBAO_CONST_TOKEN_AUTH_ME: 'auth_me',
    ABIBAO_CONST_TOKEN_FINGERPRINT: 'fingerprint',
    ABIBAO_CONST_TOKEN_EMAIL_VERIFICATION: 'email_verification',
    ABIBAO_CONST_TOKEN_CAMPAIGN_PUBLISH: 'campaign_publish',
    ABIBAO_CONST_TOKEN_ABIBAO_CAMPAIGN_PUBLISH_AUTO: 'abibao_campaign_publish_auto',
    ABIBAO_CONST_ENTITY_TYPE_NONE: 'none',
    ABIBAO_CONST_ENTITY_TYPE_ABIBAO: 'abibao',
    ABIBAO_CONST_ENTITY_TYPE_CHARITY: 'charity',
    ABIBAO_CONST_ENTITY_TYPE_COMPANY: 'company',
    ABIBAO_CONST_USER_SCOPE_ADMINISTRATOR: 'administrator',
    ABIBAO_CONST_USER_SCOPE_INDIVIDUAL: 'individual'
  },
  events: { },
  domain: false
}

// use debuggers reference
var abibao = {
  debug: global.ABIBAO.debuggers.domain,
  error: global.ABIBAO.debuggers.error
}

internals.initialize = function () {
  abibao.debug('start initializing')
  return new Promise(function (resolve, reject) {
    try {
      internals.domain.dictionnary = []
      internals.domain.injector = internals.injector
      internals.domain.execute = internals.execute
      internals.domain.injector('commands')
        .then(function () {
          return internals.domain.injector('queries')
        })
        .finally(resolve)
        .catch(reject)
    } catch (error) {
      abibao.error(error)
      reject(error)
    }
  })
}

module.exports.singleton = function () {
  return new Promise(function (resolve, reject) {
    if (internals.domain !== false) { resolve() }
    internals.domain = { }
    internals.initialize()
      .then(function () {
        global.ABIBAO.services.domain = internals.domain
        global.ABIBAO.events.DomainEvent = internals.events
        global.ABIBAO.constants.DomainConstant = internals.constants
        resolve()
      })
      .catch(function (error) {
        internals.domain = false
        abibao.error(error)
        reject(error)
      })
  })
}

internals.injector = function (type) {
  var self = internals.domain
  return new Promise(function (resolve) {
    abibao.debug('[' + type + ']')
    // custom
    var files = fs.readdirSync(path.resolve(__dirname, type))
    async.mapSeries(files, function (item, next) {
      if (item !== 'system') {
        var name = path.basename(item, '.js')
        abibao.debug('>>> [' + _.upperFirst(name) + '] has just being injected')
        self[name] = require('./' + type + '/' + name)
        self.dictionnary.push(name)
      }
      next(null, true)
    }, function () {
      resolve()
    })
  })
}

internals.execute = function (type, promise, params) {
  return new Promise(function (resolve, reject) {
    var starttime = new Date()
    var data = {
      uuid: uuid.v1(),
      environnement: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_ENV'),
      type: type,
      promise: promise
    }
    abibao.debug('[%s] start %s %s %o', data.uuid, type, promise, params)
    global.ABIBAO.services.domain[promise](params)
      .then(function (result) {
        data.exectime = new Date() - starttime
        // loggers
        if (global.ABIBAO.environnement === 'prod') {
          global.ABIBAO.logger.info(data)
        }
        // debuggers
        abibao.debug('[%s] finish %s %s', data.uuid, type, promise)
        // return
        resolve(result)
      })
      .catch(function (error) {
        data.exectime = new Date() - starttime
        data.error = error
        // loggers
        if (global.ABIBAO.environnement === 'prod') {
          global.ABIBAO.logger.error(data)
        }
        // debuggers
        abibao.error('[%s] finish %s %s %o', data.uuid, type, promise, error)
        // return
        reject(error)
      })
  })
}
