'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var Promise = require('bluebird')
var path = require('path')
var fse = require('fs-extra')
var async = require('async')
var _ = require('lodash')
var bson = require('bson')
var ObjectId = bson.ObjectId
var engine = require('../src/engine')

var optionsRethink = {
  host: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST'),
  port: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT'),
  db: 'recemvp', // nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'),
  authKey: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
  silent: true
}
var thinky = require('thinky')(optionsRethink)

var optionsMySQL = {
  client: 'mysql',
  pool: {
    max: 10000
  },
  connection: {
    host: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_HOST'),
    port: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PORT'),
    user: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
    password: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PASSWORD'),
    database: 'analytics_deve' // nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
  },
  debug: false
}
var knex = require('knex')(optionsMySQL)

var stepUser = function (tUser) {
  return new Promise(function (resolve, reject) {
    var payload
    thinky.r.table('individuals').filter({email: tUser['user_email']})
      .then(function (users) {
        if (users.length === 0) {
          console.log('%s will be created', tUser['user_email'])
          payload = {
            email: tUser['user_email'].toLowerCase(),
            password1: 'CreateFromNothing',
            password2: 'CreateFromNothing',
            hasRegisteredEntity: 'none:old'
          }
          global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', payload)
            .then(function () {
              payload = {
                email: tUser['user_email'].toLowerCase(),
                password: 'CreateFromNothing'
              }
              return global.ABIBAO.services.domain.execute('command', 'individualLoginWithCredentialsCommand', payload)
            })
            .then(function (result) {
              resolve(result)
            })
            .catch(function (error) {
              console.log('[0] %o', payload)
              reject(error)
            })
        } else {
          console.log('%s exists with id=%s', tUser['user_email'], tUser['user_id'])
          payload = {
            email: tUser['user_email'].toLowerCase(),
            password: 'CreateFromNothing'
          }
          global.ABIBAO.services.domain.execute('command', 'individualLoginWithCredentialsCommand', payload)
            .then(function (result) {
              resolve(result)
            })
            .catch(function (error) {
              console.log('[1] %o', payload)
              reject(error)
            })
        }
      })
  })
}

var stepTDATA = function (tUser) {
  return new Promise(function (resolve, reject) {
    var data = {
      answers: {},
      campaign: '56eb24cfe9b0fbf30250f8c7',
      charity: '56aa131ca533a2a04be325ae',
      company: '56aa131ca533a2a04be325ae',
      complete: true
    }
    var tDatas
    var tData
    knex('t_datas')
      .where({'user_id': tUser['user_id']})
      .then(function (result) {
        tDatas = result
        if (tDatas.length === 0) {
          resolve()
        } else {
          tData = tDatas[0]
          console.log(tData)
          data.answers.ABIBAO_ANSWER_FONDAMENTAL_AGE = 2015 - tData['datas_age']
          return global.ABIBAO.services.domain.execute('query', 'campaignItemChoiceFilterQuery', {
            prefix: 'GENDER',
            suffix: (tData['datas_genre'] === 'h') ? 'MALE' : 'FEMALE'
          })
        }
      })
      .then(function (genders) {
        if (genders.length === 0) {
          resolve()
        } else {
          var gender = genders[0]
          data.answers.ABIBAO_ANSWER_FONDAMENTAL_GENDER = global.ABIBAO.services.domain.getIDfromURN(gender.urn)
          return thinky.r.table('campaigns_items_choices').filter({prefix: 'ABIBAO_CONST_DPT'})
        }
      })
      .then(function (departments) {
        var department = _.filter(departments, {'suffix': tData['datas_dpts'].toString()})[0]
        if (department) {
          data.answers.ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT = department.id
        }
        return thinky.r.table('campaigns_items_choices').filter({prefix: 'ABIBAO_CONST_CSP'})
      })
      .then(function (csps) {
        var csp = _.filter(csps, {'suffix': tData['datas_csp'].toString()})[0]
        if (csp) {
          data.answers.ABIBAO_ANSWER_FONDAMENTAL_CSP = csp.id
        }
        // end of data
        if (Object.keys(data.answers).length === 4) {
        } else {
          data.complete = false
        }
        console.log(data)
        resolve()
      })
      .catch(function () {
        resolve()
      })
  })
}

console.log('===== START ===============')
var cacheDir = path.resolve(__dirname, '../.cache/tusers')
fse.ensureDirSync(cacheDir)
fse.emptyDirSync(cacheDir)

var usersNew = []
var usersOld = []

engine()
  .then(function () {
    knex('t_user')
      .select()
      .then(function (tUsers) {
        usersOld = tUsers
        async.mapLimit(usersOld, 10, function (item, next) {
          stepUser(item)
            .then(function (result) {
              usersNew.push(result)
              next()
            })
            .catch(next)
        }, function () {
          console.log('usersOld=%s', usersOld.length)
          console.log('usersNew=%s', usersNew.length)
          console.log('===== END ===============')
          process.exit(0)
          knex.destroy()
        })
      })
  })
