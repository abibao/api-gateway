'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var _ = require('lodash')
var async = require('async')
var path = require('path')
var fse = require('fs-extra')

var optionsRethink = {
  host: nconf.get('RETHINKDB_ENV_DOCKERCLOUD_SERVICE_FQDN'),
  port: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT'),
  db: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'),
  user: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_USER'),
  password: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PASSWORD'),
  authKey: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
  silent: true
}
var r = require('thinky')(optionsRethink).r

console.log('===== PREPARE ===============')
var cacheDir = path.resolve(__dirname, '../.cache/mysql/answers')
fse.ensureDirSync(cacheDir)
fse.emptyDirSync(cacheDir)

console.log('===== START ===============')
var dir = path.resolve(__dirname, '../.cache/rethinkdb/surveys')

var files = fse.readdirSync(dir)

var isURN = function (value) {
  try {
    fse.accessSync(path.resolve(__dirname, '../.cache/rethinkdb/campaigns_items_choices', value + '.json'))
    return true
  } catch (e) {
    return false
  }
}

var busSend = function (dirpath, message, callback) {
  console.log('..... rethink')
  var filepath = path.resolve(dirpath, message.label + '__' + message.answer + '.json')
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
}

var checksum = 0
var callbackDone

var q = async.queue(function (task, callback) {
  console.log('..... queue')
  busSend(task.dir, task.message, callback)
}, 20)

// assign a callback
q.drain = function () {
  console.log('..... all items have been processed')
  callbackDone()
}

async.mapSeries(files, function (file, done) {
  callbackDone = done
  var filepath = path.resolve(dir, file)
  var survey = fse.readJsonSync(filepath)
  var answers = Object.keys(survey.answers)
  console.log('surveys %s has %s answers', survey.id, answers.length)
  if (answers.length === 0) {
    callbackDone()
  } else {
    var answerDir = path.resolve(cacheDir, path.basename(file, '.json'))
    fse.ensureDirSync(answerDir)
    _.map(answers, function (answer) {
      var control = survey.answers[answer]
      if (_.isArray(control) === true) {
        _.map(control, function (item) {
          console.log('..... (MULTI) answer=%s', item)
          checksum += 1
          q.push({
            answer,
            dir: answerDir,
            message: {
              survey: survey.id,
              label: answer,
              answer: item,
              isURN: isURN(item)
            }
          })
        })
      } else {
        console.log('..... (SINGLE) answer=%s', control)
        checksum += 1
        q.push({
          answer,
          dir: answerDir,
          message: {
            survey: survey.id,
            label: answer,
            answer: survey.answers[answer],
            isURN: isURN(survey.answers[answer])
          }
        })
      }
    })
  }
}, function () {
  console.log('checksum=%s', checksum)
  console.log('===== END ===============')
  process.exit(0)
})
