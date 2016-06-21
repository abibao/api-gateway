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
  db: 'prodmvp', // nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'),
  authKey: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
  silent: true
}
var thinky = require('thinky')(optionsRethink)

console.log('===== PREPARE ===============')
var cacheDir = path.resolve(__dirname, '../.cache/mysql/users')
fse.ensureDirSync(cacheDir)
fse.emptyDirSync(cacheDir)

console.log('===== START ===============')
var dir = path.resolve(__dirname, '../.cache/rethinkdb/individuals')

var files = fse.readdirSync(dir)

var busSend = function (individual, callback) {
  console.log('..... rethink')
  thinky.r.db('prodmvp').table('surveys')
    .filter({individual: individual.id})
    .map(function (item) {
      return item('answers')
    })
    .forEach(function (item) {
      return item
    })
    .pluck(
      'ABIBAO_ANSWER_FONDAMENTAL_AGE',
      'ABIBAO_ANSWER_FONDAMENTAL_CSP',
      'ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT',
      'ABIBAO_ANSWER_FONDAMENTAL_GENDER'
  )
    .then(function (result) {
      var data = {
        email: individual.email || null,
        charity: individual.charity || null,
        registeredCharity: individual.hasRegisteredEntity || null,
        age: result.ABIBAO_ANSWER_FONDAMENTAL_AGE || null,
        csp: result.ABIBAO_ANSWER_FONDAMENTAL_CSP || null,
        department: result.ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT || null,
        gender: result.ABIBAO_ANSWER_FONDAMENTAL_GENDER || null,
        createdAt: individual.createdAt,
        modifiedAt: individual.modifiedAt
      }
      var filepath = ''
      // consolidate data
      if (data.age !== null) {
        data.age = parseInt(data.age)
      }
      filepath = path.resolve(__dirname, '../.cache/rethinkdb/entities', data.charity + '.json')
      if (fse.existsSync(filepath)) {
        data.charity = fse.readJsonSync(filepath).name
      }
      filepath = path.resolve(__dirname, '../.cache/rethinkdb/entities', data.registeredCharity + '.json')
      if (fse.existsSync(filepath)) {
        data.registeredCharity = fse.readJsonSync(filepath).name
      }
      filepath = path.resolve(__dirname, '../.cache/rethinkdb/campaigns_items_choices', data.csp + '.json')
      if (fse.existsSync(filepath)) {
        data.csp = fse.readJsonSync(filepath).text
      }
      filepath = path.resolve(__dirname, '../.cache/rethinkdb/campaigns_items_choices', data.department + '.json')
      if (fse.existsSync(filepath)) {
        data.department = fse.readJsonSync(filepath).text
      }
      filepath = path.resolve(__dirname, '../.cache/rethinkdb/campaigns_items_choices', data.gender + '.json')
      if (fse.existsSync(filepath)) {
        data.gender = fse.readJsonSync(filepath).text
      }
      // return data
      filepath = path.resolve(cacheDir, individual.id + '.json')
      fse.writeJsonSync(filepath, data)
      callback()
    })
}

var checksum = 0
var callbackDone

var q = async.queue(function (individual, callback) {
  console.log('..... queue')
  busSend(individual, callback)
}, 20)

// assign a callback
q.drain = function () {
  console.log('..... all items have been processed')
  callbackDone()
}

async.mapSeries(files, function (file, done) {
  callbackDone = done
  var filepath = path.resolve(dir, file)
  var individual = fse.readJsonSync(filepath)
  console.log('individual id=%s and email=%s', individual.id, individual.email)
  checksum += 1
  q.push(individual)
}, function () {
  console.log('checksum=%s', checksum)
  console.log('===== END ===============')
  process.exit(0)
})
