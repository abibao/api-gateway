'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

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
var r = thinky.r

var execBatch = function (table) {
  return new Promise(function (resolve, reject) {
    console.log('delete %s', table)
    r.table(table).delete()
      .then(function () {
        // insert
        var dir = path.resolve(__dirname, '../.cache/rethinkdb', table)
        var files = fse.readdirSync(dir)
        async.mapSeries(files, function (file, done) {
          var filepath = path.resolve(dir, file)
          var json = fse.readJsonSync(filepath)
          console.log('...... %s', json.id)
          r.table(table).insert(json)
            .then(function () {
              done()
            })
        }, function (err) {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
  })
}

console.log('===== START ===============')
var tables = ['administrators', 'individuals', 'entities', 'campaigns', 'campaigns_items', 'campaigns_items_choices', 'surveys']

async.mapSeries(tables, function (table, next) {
  execBatch(table)
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
  console.log('===== END ===============')
  process.exit(0)
})
