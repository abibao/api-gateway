#!/usr/bin/env node
'use strict'

var Promise = require('bluebird')
var Hoek = require('hoek')
var glob = require('glob')
var async = require('async')
var path = require('path')
var fse = require('fs-extra')
var _ = require('lodash')
var ProgressBar = require('progress')
var colors = require('colors/safe')

var envValue = null

var program = require('commander')
program
  .arguments('[environment]')
  .action((environment) => {
    envValue = environment
  })

program.parse(process.argv)

console.log('')
console.log(colors.green.bold('***************************************************'))
console.log(colors.green.bold('create or update answers in mysql from cache'))
console.log(colors.green.bold('***************************************************'))
console.log(colors.yellow.bold('environment:'), envValue || 'no environment given!')

if (!envValue) {
  process.exit(1)
}

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-' + envValue + '.json' })

// rethinkdb
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

// mysql
var optionsMysql = {
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
var knex = require('knex')(optionsMysql)

// select files cache
var cacheDir = path.resolve(__dirname, '.cache', envValue, 'rethinkdb')
var mysqlDir = path.resolve(__dirname, '.cache', envValue, 'mysql/answers')
fse.ensureDirSync(mysqlDir)
fse.emptyDirSync(mysqlDir)

// initialize progress bar
var patternPath = path.resolve(cacheDir, 'surveys') + '/**/*.json'
var files = glob.sync(patternPath, {
  nodir: true,
  dot: true,
  ignore: ['index.js']
})
var total = files.length
console.log(colors.yellow.bold('total:'), total)
console.log(colors.green.bold('***************************************************'))

var isURN = function (value) {
  try {
    fse.accessSync(path.resolve(cacheDir, 'campaigns_items_choices', value + '.json'))
    return true
  } catch (e) {
    return false
  }
}

// handler
var execBatch = function (filepath, bar, callback) {
  var survey = fse.readJsonSync(filepath)
  var answers = Object.keys(survey.answers)
  var messages = []
  _.map(answers, function (answer) {
    var data = {
      email: survey.individual,
      'charity_id': survey.charity,
      'charity_name': survey.charity,
      'campaign_id': survey.campaign,
      'campaign_name': survey.campaign,
      question: answer,
      answer: survey.answers[answer],
      'answer_text': survey.answers[answer],
      createdAt: false
    }
    if (_.isArray(survey.answers[answer])) {
      _.map(survey.answers[answer], function (item) {
        var duplicate = Hoek.clone(data)
        duplicate.answer = item
        duplicate['answer_text'] = item
        messages.push(duplicate)
      })
    } else {
      messages.push(data)
    }
  })
  async.mapSeries(messages, (message, next) => {
    r.table('surveys')
      .get(message.survey)
      .merge(function (item) {
        return {
          data: {
            email: r.table('individuals').get(item('individual'))('email'),
            'charity_id': item('charity'),
            'charity_name': r.table('entities').get(item('charity'))('name'),
            'campaign_id': item('campaign'),
            'campaign_name': r.table('campaigns').get(item('campaign'))('name'),
            question: message.label,
            answer: message.answer,
            'answer_text': (message.isURN === true) ? r.table('campaigns_items_choices').get(message.answer)('text') : message.answer,
            createdAt: item('createdAt')
          }
        }
      })
      .then(function (result) {
        fse.writeJsonSync(filepath, result.data)
        callback()
      })
      .catch(function () {
        callback()
      })
  })
}

// run the script
var run = () => {
  var bar = new ProgressBar('progress [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total
  })
  async.mapSeries(files, (file, next) => {
    execBatch(file, bar, next)
  }, (err, results) => {
    if (err) {
      console.log('\n', colors.bgRed.bold(' ERROR! '))
      console.log(err, '\n')
      process.exit(1)
    } else {
      console.log('\n', colors.bgGreen.bold(' DONE! '), '\n')
      process.exit(0)
    }
  })
}

run()
