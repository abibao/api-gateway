'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-prod.json' })

var async = require('async')
var path = require('path')
var fse = require('fs-extra')
var glob = require('glob')
var mapLimit = require('promise-maplimit')

var options = {
  client: 'mysql',
  connection: {
    host: nconf.get('MYSQL_ENV_DOCKERCLOUD_SERVICE_FQDN'),
    port: nconf.get('MYSQL_PORT_3306_TCP_PORT'),
    user: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
    password: nconf.get('MYSQL_ENV_MYSQL_ROOT_PASSWORD'),
    database: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
  },
  debug: false
}
var knex = require('knex')(options)

console.log('===== START ===============')

var cacheDir = path.resolve(__dirname, '../.cache/mysql/answers')

var answers = []
var files = glob.sync(cacheDir + '/**/*.json', {
  nodir: true,
  dot: true
})

console.log('number of files: %s', files.length)
async.map(files, function (file) {
  var data = fse.readJsonSync(file)
  data.createdAt = new Date(data.createdAt)
  answers.push(knex('answers').insert(data))
})
console.log('number of answers: %s', answers.length)

knex('answers')
  .delete()
  .then(() => {
    return mapLimit(answers, 100, function (item, index, array) {
      console.log('... ', files[index])
    })
  })
  .then(() => {
    console.log('===== END ===============')
    knex.destroy()
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    console.log('===== END ERROR ===============')
    knex.destroy()
    process.exit(1)
  })
