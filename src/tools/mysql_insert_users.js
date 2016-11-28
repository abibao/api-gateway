'use strict'

var args = process.argv
args.shift()
args.shift()

// **********************
// Only one argument is allow and mandatory: environnement
// **********************
try {
  var arg = {
    label: args[0].split('=')[0],
    value: args[0].split('=')[1]
  }
  if (arg.label !== 'environnement') {
    console.log('environnement is mandatory')
    process.exit(1)
  }
  if (arg.value !== 'deve' && arg.value !== 'rece' && arg.value !== 'prod') {
    console.log('not a valid environnement')
    process.exit(1)
  }
} catch (e) {
  console.log(e)
  process.exit(1)
}
// **********************

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-' + arg.value + '.json' })

var _ = require('lodash')
var fse = require('fs-extra')
var path = require('path')
var glob = require('glob')
var ProgressBar = require('progress')
var ProgressPromise = require('progress-promise')

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

var cacheDir = path.resolve(__dirname, '../../.cache/mysql/users')

console.log('===== START ===============')
console.log('delete users')
knex('users')
  .delete()
  .then(() => {
    console.log('get all files users')
    var files = glob.sync(cacheDir + '/**/*.json', {
      nodir: true,
      dot: true
    })
    var total = files.length
    console.log('number of files: %s', files.length)
    var bar = new ProgressBar('progress [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 40,
      total
    })
    var placeInQueue = function (source) {
      var files = _.take(source, 300)
      var queue = []
      _.map(files, (file) => {
        var data = fse.readJsonSync(file)
        data.createdAt = new Date(data.createdAt)
        data.modifiedAt = new Date(data.modifiedAt)
        queue.push(knex('users').insert(data))
      })
      if (queue.length === 0) {
        console.log('all users have been processed')
        console.log('===== END ===============')
        knex.destroy()
        process.exit(0)
      }
      ProgressPromise.all(queue)
        .progress(() => {
          bar.tick()
        })
        .then(() => {
          source = _.difference(source, files)
          placeInQueue(source)
        })
        .catch((error) => {
          console.log(error)
          console.log('===== END ===============')
          knex.destroy()
          process.exit(1)
        })
    }
    placeInQueue(files)
  })
