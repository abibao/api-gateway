#!/usr/bin/env node
'use strict'

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
  host: nconf.get('ABIBAO_API_GATEWAY_RETHINKDB_HOST'),
  port: nconf.get('ABIBAO_API_GATEWAY_RETHINKDB_PORT'),
  db: nconf.get('ABIBAO_API_GATEWAY_RETHINKDB_DATABASE'),
  user: nconf.get('ABIBAO_API_GATEWAY_RETHINKDB_USER'),
  password: nconf.get('ABIBAO_API_GATEWAY_RETHINKDB_PASS'),
  silent: true
}
var r = require('thinky')(options).r

// mysql
var optionsMysql = {
  client: 'pg',
  connection: {
    host: nconf.get('ABIBAO_API_GATEWAY_POSTGRES_HOST'),
    port: nconf.get('ABIBAO_API_GATEWAY_POSTGRES_PORT'),
    user: nconf.get('ABIBAO_API_GATEWAY_POSTGRES_USER'),
    password: nconf.get('ABIBAO_API_GATEWAY_POSTGRES_PASS'),
    database: nconf.get('ABIBAO_API_GATEWAY_POSTGRES_DATABASE')
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
    var message = {
      survey: survey.id,
      label: answer
    }
    if (_.isArray(survey.answers[answer])) {
      // console.log(answer, 'is an array')
      _.map(survey.answers[answer], function (item) {
        // console.log('...', item, 'is an item')
        var duplicate = Hoek.clone(message)
        duplicate.answer = item
        duplicate.isURN = isURN(item)
        messages.push(duplicate)
      })
    } else {
      // console.log(answer, 'is unique')
      message.answer = survey.answers[answer]
      message.isURN = isURN(survey.answers[answer])
      messages.push(message)
    }
  })
  // console.log(messages)
  async.mapLimit(messages, 50, (message, next) => {
    if (_.isNull(message.answer)) {
      console.log(survey)
      console.log(message)
      process.exit(-1)
    }
    r.table('surveys')
      .get(message.survey)
      .merge(function (item) {
        return {
          data: {
            'email': r.table('individuals').get(item('individual'))('email'),
            'charity_id': item('charity'),
            'charity_name': r.table('entities').get(item('charity'))('name'),
            'campaign_id': item('campaign'),
            'campaign_name': r.table('campaigns').get(item('campaign'))('name'),
            'question': message.label,
            'answer': message.answer,
            'answer_text': (message.isURN === true) ? r.table('campaigns_items_choices').get(message.answer)('text') : message.answer,
            'created_at': item('modifiedAt')
          }
        }
      })
      .then(function (result) {
        var targetpath = path.resolve(mysqlDir, result.data.campaign_id, result.data.question, result.data.id + '.json')
        fse.ensureFileSync(targetpath)
        fse.writeJsonSync(targetpath, result.data)
        // write in mysql
        if (result.data.answer && result.data.question) {
          return knex('answers')
            .where('email', result.data.email)
            .andWhere('campaign_id', result.data.campaign_id)
            .andWhere('question', result.data.question)
            .delete()
            .then(() => {
              return knex('answers').insert(result.data)
            })
        } else {
          return false
        }
      })
      .then(() => {
        next()
      })
      .catch(function (error) {
        console.log('error.message', error)
        next()
      })
  }, () => {
    bar.tick()
    callback()
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
  async.mapLimit(files, 10, (file, next) => {
    execBatch(file, bar, next)
  }, (err, results) => {
    if (err) {
      // knex.destroy()
      console.log('\n', colors.bgRed.bold(' ERROR! '))
      console.log(err, '\n')
      process.exit(1)
    } else {
      // knex.destroy()
      console.log('\n', colors.bgGreen.bold(' DONE! '), '\n')
      process.exit(0)
    }
  })
}

run()
