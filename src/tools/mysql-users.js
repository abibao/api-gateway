#!/usr/bin/env node
'use strict'

var Promise = require('bluebird')
var glob = require('glob')
var async = require('async')
var path = require('path')
var fse = require('fs-extra')
var _ = require('lodash')
var ProgressBar = require('progress')
var colors = require('colors/safe')

var envValue = null

var program = require('commander')
program
  .arguments('[environment]')
  .action((environment) => {
    envValue = environment
  })

program.parse(process.argv)

console.log('')
console.log(colors.green.bold('***************************************************'))
console.log(colors.green.bold('create or update users in mysql from cache'))
console.log(colors.green.bold('***************************************************'))
console.log(colors.yellow.bold('environment:'), envValue || 'no environment given!')

if (!envValue) {
  process.exit(1)
}

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-' + envValue + '.json' })

// rethinkdb
var options = {
  host: nconf.get('RETHINKDB_ENV_DOCKERCLOUD_SERVICE_FQDN'),
  port: nconf.get('RETHINKDB_PORT_28015_TCP_PORT'),
  db: nconf.get('ABIBAO_API_GATEWAY_DATABASES_RETHINKDB_MVP'),
  user: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_USER'),
  password: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PASSWORD'),
  authKey: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
  silent: true
}
var r = require('thinky')(options).r

// mysql
var optionsMysql = {
  client: 'pg',
  connection: {
    host: nconf.get('MYSQL_ENV_DOCKERCLOUD_SERVICE_FQDN'),
    port: nconf.get('MYSQL_PORT_3306_TCP_PORT'),
    user: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
    password: nconf.get('MYSQL_ENV_MYSQL_ROOT_PASSWORD'),
    database: nconf.get('ABIBAO_API_GATEWAY_DATABASES_MYSQSL_MVP')
  },
  debug: false
}
var knex = require('knex')(optionsMysql)

// select files cache
var cacheDir = path.resolve(__dirname, '.cache', envValue, 'rethinkdb')
var mysqlDir = path.resolve(__dirname, '.cache', envValue, 'mysql/users')
fse.ensureDirSync(mysqlDir)
fse.emptyDirSync(mysqlDir)

// initialize progress bar
var patternPath = path.resolve(cacheDir, 'individuals') + '/*.json'
var files = glob.sync(patternPath, {
  nodir: true,
  dot: true,
  ignore: ['index.js']
})
var total = files.length
console.log(colors.yellow.bold('total:'), total)
console.log(colors.green.bold('***************************************************'))

// handler
var execBatch = function (filepath, bar, callback) {
  var individual = fse.readJsonSync(filepath)
  r.table('surveys')
    .filter({individual: individual.id})
    .map(function (item) {
      return item('answers')
    })
    .forEach(function (item) {
      return item
    })
    .pluck('ABIBAO_ANSWER_FONDAMENTAL_AGE', 'ABIBAO_ANSWER_FONDAMENTAL_CSP', 'ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT', 'ABIBAO_ANSWER_FONDAMENTAL_GENDER')
    .then(function (item) {
      var props = Object.keys(item)
      var promises = {
        'CHARITY': r.table('entities').get(individual.charity)('name'),
        'HAS_REGISTERED_ENTITY': r.table('entities').get(individual.hasRegisteredEntity)('name')
      }
      _.map(props, function (prop) {
        switch (prop) {
          case 'ABIBAO_ANSWER_FONDAMENTAL_AGE':
            promises[prop] = parseInt(item.ABIBAO_ANSWER_FONDAMENTAL_AGE)
            break
          case 'ABIBAO_ANSWER_FONDAMENTAL_CSP':
            promises[prop] = r.table('campaigns_items_choices').get(item.ABIBAO_ANSWER_FONDAMENTAL_CSP)('text')
            break
          case 'ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT':
            promises[prop] = r.table('campaigns_items_choices').get(item.ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT)('text')
            break
          case 'ABIBAO_ANSWER_FONDAMENTAL_GENDER':
            promises[prop] = r.table('campaigns_items_choices').get(item.ABIBAO_ANSWER_FONDAMENTAL_GENDER)('text')
            break
          default:
        }
      })
      var data
      return Promise.props(promises)
        .then((result) => {
          data = {
            email: individual.email || null,
            charity: result.CHARITY || null,
            registeredCharity: result.HAS_REGISTERED_ENTITY || null,
            age: result.ABIBAO_ANSWER_FONDAMENTAL_AGE || null,
            csp: result.ABIBAO_ANSWER_FONDAMENTAL_CSP || null,
            department: result.ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT || null,
            gender: result.ABIBAO_ANSWER_FONDAMENTAL_GENDER || null,
            createdAt: new Date(individual.createdAt)
          }
          var target = path.resolve(mysqlDir, individual.id + '.json')
          fse.writeJsonSync(target, data)
          // write in mysql
          return knex('users').where('email', data.email)
        })
        .then((result) => {
          if (result.length === 0) {
            return knex('users').insert(data)
          } else {
            return knex('users').where('email', data.email).update(data)
          }
        })
        .then((result) => {
          bar.tick()
          callback()
        })
    })
    .catch((error) => {
      console.log('error.message', error)
      bar.tick()
      callback()
    })
}

// run the script
var run = () => {
  var bar = new ProgressBar('progress [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total
  })
  async.mapLimit(files, 10, (file, next) => {
    execBatch(file, bar, next)
  }, (err, results) => {
    knex.destroy()
    if (err) {
      console.log('\n', colors.bgRed.bold(' ERROR! '))
      console.log(err, '\n')
      process.exit(1)
    } else {
      console.log('\n', colors.bgGreen.bold(' DONE! '), '\n')
      process.exit(0)
    }
  })
}

run()
