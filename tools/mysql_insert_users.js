'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var async = require('async')
var path = require('path')
var fse = require('fs-extra')
var recursive = require('recursive-readdir')

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
    database: 'analytics' // nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
  },
  debug: false
}

console.log('===== START ===============')
var cacheDir = path.resolve(__dirname, '../.cache/mysql/users')

var answers = []

recursive(cacheDir, function (err, files) {
  console.log('number of files: %s', files.length)
  async.map(files, function (file) {
    answers.push(fse.readJsonSync(file))
  })
  console.log('number of answers: %s', answers.length)

  var knex = require('knex')(optionsMySQL)
  knex('users')
    .delete()
    .then(function () {
      return knex('users').insert(answers)
        .then(function (inserted) {
          console.log('..... inserted', inserted)
          console.log('..... END')
          knex.destroy()
        })
    })
    .catch(function () {
      console.log('===== END ===============')
      process.exit(0)
      knex.destroy()
    })
})
