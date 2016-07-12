'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var async = require('async')
var path = require('path')
var fse = require('fs-extra')
var _ = require('lodash')

var argv = process.argv.slice(2)
var args = {}
_.map(argv, function (arg) {
  args[arg.split('=')[0].replace('--', 'arg_').toUpperCase()] = arg.split('=')[1]
})

var optionsRethink = {
  host: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST'),
  port: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT'),
  authKey: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
  silent: true
}
var thinky = require('thinky')(optionsRethink)

var backupTable = function (table) {
  return new Promise(function (resolve, reject) {
    console.log('backup table %s', table)
    thinky.r.db(args.ARG_RETHINK).table(table)
      .then(function (items) {
        var dir = path.resolve(__dirname, '../.cache/rethinkdb')
        fse.ensureDirSync(dir)
        var filepath = path.resolve(dir, table + '.json')
        fse.writeJsonSync(filepath, items)
        resolve()
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

console.log('===== PREPARE ===============')
var execstart = new Date()
var cacheDir = path.resolve(__dirname, '../.cache/rethinkdb')
fse.ensureDirSync(cacheDir)
fse.emptyDirSync(cacheDir)

console.log('===== START ===============')
var tables = ['administrators', 'individuals', 'entities', 'campaigns', 'campaigns_items', 'campaigns_items_choices', 'surveys']

async.mapLimit(tables, 10, function (table, next) {
  backupTable(table)
    .then(function () {
      next()
    })
    .catch(function (error) {
      next(error)
    })
}, function (err, results) {
  if (err) {
    console.log(err)
  }
  var execend = new Date()
  console.log('exectime is %s ms', execend - execstart)
  console.log('===== END ===============')
  process.exit(0)
})
