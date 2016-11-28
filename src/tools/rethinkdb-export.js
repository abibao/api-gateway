#!/usr/bin/env node
'use strict'

var Promise = require('bluebird')
var async = require('async')
var path = require('path')
var fse = require('fs-extra')
var _ = require('lodash')
var ProgressBar = require('progress')
var colors = require('colors/safe')

var sourceValue = null
var envValue = null

var program = require('commander')
program
  .arguments('<source> [env]')
  .action((source, env) => {
    sourceValue = source
    envValue = env
  })

program.parse(process.argv)

console.log('')
console.log(colors.green.bold('***************************************************'))
console.log(colors.green.bold('rethinkdb export table(s) to file(s)'))
console.log(colors.green.bold('***************************************************'))
console.log(colors.yellow.bold('table(s):'), sourceValue || 'no table given!')
console.log(colors.yellow.bold('environment:'), envValue || 'no environment given!')
console.log(colors.green.bold('***************************************************'))

if (!sourceValue || !envValue) {
  process.exit(1)
}

if (sourceValue === 'all') {
  sourceValue = 'administrators,individuals,entities,campaigns,campaigns_items,campaigns_items_choices,surveys'
}

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-' + envValue + '.json' })
var options = {
  host: nconf.get('RETHINKDB_ENV_DOCKERCLOUD_SERVICE_FQDN'),
  port: nconf.get('RETHINKDB_PORT_28015_TCP_PORT'),
  db: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'),
  user: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_USER'),
  password: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PASSWORD'),
  authKey: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
  silent: true
}
var r = require('thinky')(options).r

// select files cache
var cacheDir = path.resolve(__dirname, '.cache', envValue, 'rethinkdb')
fse.ensureDirSync(cacheDir)
fse.emptyDirSync(cacheDir)

// initialize progress bar
var total = 0
var promises = []
var tables = sourceValue.split(',')
_.map(tables, (table) => {
  promises.push(r.table(table).count())
})
Promise.all(promises)
  .then((result) => {
    _.map(result, (count) => {
      total += count
    })
    run()
  })
  .catch(function (error) {
    console.log('\n', colors.bgRed.bold(' ERROR! '))
    console.log(colors.gray(error), '\n')
    process.exit(1)
  })

// handler
var execBatch = (table, skip, limit, bar, callback) => {
  r.table(table).skip(skip).limit(limit)
    .then(function (result) {
      var items = result
      async.mapSeries(items, function (item, next) {
        var dir = path.resolve(cacheDir, table)
        fse.ensureDirSync(dir)
        var filepath = path.resolve(dir, item.id + '.json')
        fse.writeJsonSync(filepath, item)
        bar.tick()
        next()
      }, function (err) {
        if (err) { return callback() }
        r.table(table).count().then(function (count) {
          if (skip + limit < count) {
            execBatch(table, skip + limit, limit, bar, callback)
          } else {
            callback()
          }
        })
      })
    })
    .catch(function (error) {
      callback(error)
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
  async.mapSeries(tables, function (table, next) {
    execBatch(table, 0, 100, bar, next)
  }, function (err, results) {
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
