#!/usr/bin/env node
'use strict'

var glob = require('glob')
var async = require('async')
var path = require('path')
var fse = require('fs-extra')
var _ = require('lodash')
var ProgressBar = require('progress')
var colors = require('colors/safe')

var sourceValue = null
var fromEnvValue = null
var toEnvValue = null

var program = require('commander')
program
  .arguments('<source> [fromEnv] [toEnv]')
  .action((source, fromEnv, toEnv) => {
    sourceValue = source
    fromEnvValue = fromEnv
    toEnvValue = toEnv
  })

program.parse(process.argv)

console.log('')
console.log(colors.green.bold('***************************************************'))
console.log(colors.green.bold('rethinkdb import file(s) to table(s)'))
console.log(colors.green.bold('***************************************************'))
console.log(colors.yellow.bold('file(s):'), sourceValue || 'no file given!')
console.log(colors.yellow.bold('environment (from):'), fromEnvValue || 'no environment given!')
console.log(colors.yellow.bold('environment (to):'), toEnvValue || 'no environment given!')
console.log(colors.green.bold('***************************************************'))

if (!sourceValue || !fromEnvValue || !toEnvValue) {
  process.exit(1)
}

if (sourceValue === 'all') {
  sourceValue = 'administrators,individuals,entities,campaigns,campaigns_items,campaigns_items_choices,surveys'
}

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-' + toEnvValue + '.json' })

// rethinkdb
var options = {
  host: global.ABIBAO.config('ABIBAO_API_GATEWAY_RETHINKDB_HOST'),
  port: global.ABIBAO.config('ABIBAO_API_GATEWAY_RETHINKDB_PORT'),
  db: global.ABIBAO.config('ABIBAO_API_GATEWAY_RETHINKDB_DATABASE'),
  user: global.ABIBAO.config('ABIBAO_API_GATEWAY_RETHINKDB_USER'),
  password: global.ABIBAO.config('ABIBAO_API_GATEWAY_RETHINKDB_PASS'),
  silent: true
}
var r = require('thinky')(options).r

// select files cache
var cacheDir = path.resolve(__dirname, '.cache', fromEnvValue, 'rethinkdb')

// initialize progress bar
var total = 0
var dirCount = (patternPath) => {
  var files = glob.sync(patternPath + '/*.json', {
    nodir: true,
    dot: true,
    ignore: ['index.js']
  })
  total += files.length
}
var tables = sourceValue.split(',')
_.map(tables, (table) => {
  dirCount(path.resolve(cacheDir, table))
})

// handler
var execBatch = function (table, bar, callback) {
  r.table(table).delete()
    .then(() => {
      // insert
      var dir = path.resolve(cacheDir, table)
      var files = fse.readdirSync(dir)
      async.mapSeries(files, (file, next) => {
        var filepath = path.resolve(dir, file)
        var json = fse.readJsonSync(filepath)
        bar.tick()
        r.table(table).insert(json)
          .then(() => {
            next()
          })
          .catch((error) => {
            next(error)
          })
      }, (err) => {
        if (err) {
          callback(err)
        } else {
          callback()
        }
      })
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
  async.mapSeries(tables, (table, next) => {
    execBatch(table, bar, next)
  }, (error, results) => {
    if (error) {
      console.log('\n', colors.bgRed.bold(' ERROR! '), '\n')
      console.log(error)
      process.exit(1)
    } else {
      console.log('\n', colors.bgGreen.bold(' DONE! '), '\n')
      process.exit(0)
    }
  })
}

run()
