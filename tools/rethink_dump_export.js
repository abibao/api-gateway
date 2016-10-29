'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-prod.json' })

var async = require('async')
var path = require('path')
var fse = require('fs-extra')

var optionsRethink = {
  host: nconf.get('RETHINKDB_ENV_DOCKERCLOUD_SERVICE_FQDN'),
  port: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT'),
  db: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'),
  user: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_USER'),
  password: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PASSWORD'),
  authKey: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
  silent: true
}
var r = require('thinky')(optionsRethink).r

var execReQL = function (table, skip, limit, callback) {
  r.table(table).skip(skip).limit(limit)
    .then(function (result) {
      var items = result
      console.log('table: %s skip=%s limit=%s (%s)', table, skip, limit, items.length)
      async.mapSeries(items, function (item, next) {
        console.log('..... save %s/%s.json', table, item.id)
        var dir = path.resolve(__dirname, '../.cache/rethinkdb/' + table)
        fse.ensureDirSync(dir)
        var filepath = path.resolve(dir, item.id + '.json')
        fse.writeJsonSync(filepath, item)
        next()
      }, function (err) {
        if (err) { return callback() }
        r.table(table).count().then(function (count) {
          if (skip + limit < count) {
            execReQL(table, skip + limit, limit, callback)
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

console.log('===== PREPARE ===============')
var cacheDir = path.resolve(__dirname, '../.cache/rethinkdb')
fse.ensureDirSync(cacheDir)
fse.emptyDirSync(cacheDir)

console.log('===== START ===============')
var tables = ['administrators', 'individuals', 'entities', 'campaigns', 'campaigns_items', 'campaigns_items_choices', 'surveys']

async.mapSeries(tables, function (table, next) {
  execReQL(table, 0, 100, next)
}, function (err, results) {
  if (err) {
    console.log(err)
  }
  console.log('===== END ===============')
  process.exit(0)
})