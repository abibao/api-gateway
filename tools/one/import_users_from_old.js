'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var mocha = require('../../src/mocha')

var _ = require('lodash')
var async = require('async')
var path = require('path')
var fse = require('fs-extra')

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

var users_new = []
var users_old = []

mocha()
  .then(function () {
    knex('t_datas')
      .where({user_id: 1})
      .then(function (t_datas) {
        t_datas.ABIBAO_ANSWER_FONDAMENTAL_AGE = (2015 - t_datas.datas_age).toString()
        console.log(t_datas)
      })
  })

  /*
  mocha()
    .then(function () {
      knex('t_user')
        .select()
        .then(function (t_users) {
          users_old.push(t_users[0])
          async.mapLimit(users_old, 10, function (t_user, next) {
            thinky.r.table('individuals').filter({email: t_user.user_email})
              .then(function (users) {
                if (users.length === 0) {
                  console.log('%s not exists', t_user.user_email)
                  var payload = {
                    email: t_user.user_email.toLowerCase(),
                    password1: 'CreateFromNothing',
                    password2: 'CreateFromNothing',
                    hasRegisteredEntity: 'none:old'
                  }
                  global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', payload)
                    .then(function (individual) {
                      users_new.push(individual)
                      payload.password = 'CreateFromNothing'
                      return global.ABIBAO.services.domain.execute('command', 'individualLoginWithCredentialsCommand', payload)
                    })
                    .then(function (infos) {
                      next()
                    })
                    .catch(function (error) {
                      next()
                    })
                } else {
                  console.log('%s alreasy exists', t_user.user_email)
                  next()
                }
              })
          }, function (err) {
            console.log('users_old=%s', users_old.length)
            console.log('users_new=%s', users_new.length)
            process.exit(0)
          })
        })
    })
  */
