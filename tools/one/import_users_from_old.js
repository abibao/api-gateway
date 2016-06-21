'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var async = require('async')
var engine = require('../../src/engine')

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

var usersNew = []
var usersOld = []

/* engine()
  .then(function () {
    knex('t_datas')
      .where({user_id: 1})
      .then(function (t_datas) {
        t_datas.ABIBAO_ANSWER_FONDAMENTAL_AGE = (2015 - t_datas.datas_age).toString()
        console.log(t_datas)
      })
  })
*/

engine()
  .then(function () {
    knex('t_user')
      .select()
      .then(function (tUsers) {
        usersOld.push(tUsers[0])
        async.mapLimit(usersOld, 10, function (tUser, next) {
          thinky.r.table('individuals').filter({email: tUser.user_email})
            .then(function (users) {
              if (users.length === 0) {
                console.log('%s not exists', tUser.user_email)
                var payload = {
                  email: tUser.user_email.toLowerCase(),
                  password1: 'CreateFromNothing',
                  password2: 'CreateFromNothing',
                  hasRegisteredEntity: 'none:old'
                }
                global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', payload)
                  .then(function (individual) {
                    usersNew.push(individual)
                    payload.password = 'CreateFromNothing'
                    return global.ABIBAO.services.domain.execute('command', 'individualLoginWithCredentialsCommand', payload)
                  })
                  .then(function (infos) {
                    next()
                  })
                  .catch(function () {
                    next()
                  })
              } else {
                console.log('%s alreasy exists', tUser.user_email)
                next()
              }
            })
        }, function () {
          console.log('usersOld=%s', usersOld.length)
          console.log('usersNew=%s', usersNew.length)
          process.exit(0)
        })
      })
  })
