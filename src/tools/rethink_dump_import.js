'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-rece.json' })

var async = require('async')
var path = require('path')
var fse = require('fs-extra')

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

var execBatch = function (table) {
  return new Promise(function (resolve, reject) {
    console.log('delete %s', table)
    r.table(table).delete()
      .then(function () {
        // insert
        var dir = path.resolve(__dirname, '../../.cache/rethinkdb', table)
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
