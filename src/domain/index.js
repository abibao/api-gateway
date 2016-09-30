'use strict'

var Promise = require('bluebird')
var glob = require('glob')

var internals = {
  optionsRethink: {
    host: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST'),
    port: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT'),
    db: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'),
    authKey: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
    silent: true
  },
  optionsMySQL: {
    client: 'mysql',
    connection: {
      host: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_HOST'),
      port: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PORT'),
      user: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
      password: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PASSWORD'),
      database: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
    },
    debug: false
  },
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

var _ = require('lodash')
var Cryptr = require('cryptr')
var cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))

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
      internals.domain.knex = require('knex')(internals.optionsMySQL)
      internals.domain.thinky = require('thinky')(internals.optionsRethink)
      internals.domain.ThinkyErrors = internals.domain.thinky.Errors
      internals.domain.Query = internals.domain.thinky.Query
      internals.domain.r = internals.domain.thinky.r
      internals.domain.injector = internals.injector
      internals.domain.execute = internals.execute
      internals.domain.getIDfromURN = function (urn) {
        return cryptr.decrypt(_.last(_.split(urn, ':')))
      }
      internals.domain.getURNfromID = function (id, model) {
        return 'urn:abibao:database:' + model + ':' + cryptr.encrypt(id)
      }
      internals.domain.injector('commands')
        .then(function () {
          return internals.domain.injector('queries')
        })
        .then(function () {
          return internals.domain.injector('models/mysql')
        })
        .then(function () {
          return internals.domain.injector('models/rethinkdb')
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

var async = require('async')
var path = require('path')
var uuid = require('node-uuid')

internals.injector = function (type) {
  var self = internals.domain
  return new Promise(function (resolve) {
    abibao.debug('[' + _.upperFirst(_.camelCase(type)) + ']')
    var patternPath = path.resolve(__dirname, type) + '/**/*.js'
    var patternFiles = glob.sync(patternPath, {
      nodir: true,
      dot: true,
      ignore: ['index.js']
    })
    async.mapSeries(patternFiles, function (file, next) {
      var name = path.basename(file, '.js')
      abibao.debug('>>> [' + _.upperFirst(_.camelCase(name)) + '] has just being injected')
      switch (type) {
        case 'models/rethinkdb':
          self[name] = require(file)(self.thinky)
          break
        default:
          self[name] = require(file)
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
