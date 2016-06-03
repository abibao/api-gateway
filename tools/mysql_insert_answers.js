'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var async = require('async')
var path = require('path')
var fse = require('fs-extra')

var optionsMySQL = {
  client: 'mysql',
  connection: {
    host: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_HOST'),
    port: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PORT'),
    user: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
    password: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PASSWORD'),
    database: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
  },
  debug: false
}
var knex = require('knex')(optionsMySQL)

console.log('===== START ===============')
var dirSQL = path.resolve(__dirname, '../.cache/mysql/answers')

var files = fse.readdirSync(dirSQL)

console.log('number of files: %s', files.length)

async.mapLimit(files, 50, function (file, next) {
  var filepathSQL = path.resolve(dirSQL, file)
  console.log(filepathSQL)
  var data = fse.readJsonSync(filepathSQL)
  knex('answers')
    .where('email', data.email)
    .where('campaign_id', data.campaign_id)
    .where('question', data.question)
    .delete()
    .then(function () {
      return knex('answers').insert(data)
        .then(function (inserted) {
          console.log('----------------------> inserted', inserted)
          console.log('----------------------> END')
          next()
        })
    })
    .catch(function (error) {
      console.log('----------------------> error', error)
      console.log('----------------------> END')
      next()
    })
}, function () {
  console.log('===== END ===============')
  process.exit(0)
})
