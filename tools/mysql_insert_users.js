'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var async = require('async')
var path = require('path')
var fse = require('fs-extra')
var glob = require('glob')

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

var cacheDir = path.resolve(__dirname, '../.cache/mysql/users')

var users = []
var files = glob.sync(cacheDir + '/*.json', {
  nodir: true,
  dot: true
})

console.log('number of files: %s', files.length)
async.map(files, function (file) {
  var data = fse.readJsonSync(file)
  data.createdAt = new Date(data.createdAt)
  data.modifiedAt = new Date(data.modifiedAt)
  users.push(data)
})
console.log('number of users: %s', users.length)

knex('users')
  .delete()
  .then(() => {
    return knex('users').insert(users)
  })
  .then(() => {
    console.log('===== END ===============')
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    console.log('===== END ERROR ===============')
    process.exit(1)
  })
