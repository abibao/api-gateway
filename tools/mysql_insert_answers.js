'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-rece.json' })

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

var cacheDir = path.resolve(__dirname, '../.cache/mysql/answers')

console.log('===== START ===============')
console.log('delete answers')
knex('answers')
  .delete()
  .then(() => {
    console.log('get all files answers')
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
      var files = _.take(source, 100)
      var queue = []
      _.map(files, (file) => {
        var data = fse.readJsonSync(file)
        data.createdAt = new Date(data.createdAt)
        queue.push(knex('answers').insert(data))
      })
      if (queue.length === 0) {
        console.log('all answers have been processed')
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
