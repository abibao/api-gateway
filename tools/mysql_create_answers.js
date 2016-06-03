'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var _ = require('lodash')
var async = require('async')
var path = require('path')
var fse = require('fs-extra')
var Chance = require('chance')
var chance = new Chance()

var optionsRethink = {
  host: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST'),
  port: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT'),
  db: 'prodmvp', // nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'),
  authKey: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
  silent: true
}
var thinky = require('thinky')(optionsRethink)

console.log('===== PREPARE ===============')
var cacheDir = path.resolve(__dirname, '../.cache/mysql/answers')
fse.emptyDirSync(cacheDir)

console.log('===== START ===============')
var dir = path.resolve(__dirname, '../.cache/rethinkdb/surveys')
var dirSQL = path.resolve(__dirname, '../.cache/mysql/answers')
fse.ensureDirSync(dirSQL)

var files = fse.readdirSync(dir)

var busSend = function (message, callback) {
  console.log('----------------------> START')
  thinky.r.table('surveys')
    .get(message.survey)
    .merge(function (item) {
      return {
        data: {
          email: thinky.r.table('individuals').get(item('individual'))('email'),
          charity_id: item('charity'),
          charity_name: thinky.r.table('entities').get(item('charity'))('name'),
          campaign_id: item('campaign'),
          campaign_name: thinky.r.table('campaigns').get(item('campaign'))('name'),
          question: message.label,
          answer: message.answer,
          answer_text: (message.isURN === true) ? thinky.r.table('campaigns_items_choices').get(message.answer)('text') : message.answer
        }
      }
    })
    .then(function (result) {
      var id = chance.guid() + '-' + chance.guid() + '-' + chance.guid()
      var filepathSQL = path.resolve(dirSQL, id + '.json')
      fse.writeJsonSync(filepathSQL, result.data)
      callback()
    })
}

var checksum = 0

async.mapSeries(files, function (file, done) { // ASYNC 0 :: the divine!
  var filepath = path.resolve(dir, file)
  var survey = fse.readJsonSync(filepath)
  var answers = Object.keys(survey.answers)
  checksum += answers.length
  console.log('surveys %s has %s answers', survey.id, answers.length)
  async.mapSeries(answers, function (answer, next1) { // ASYNC 1
    var payload = {
      label: answer,
      answer: survey.answers[answer]
    }
    var control = survey.answers[answer]
    console.log('..... %s', answer, control, _.isArray(control))
    // event for analytics
    var _answer
    var isURN = false
    if (_.isArray(control) === true) {
      async.mapSeries(control, function (item, next2) { // ASYNC 2(multi)
        try {
          fse.accessSync(path.resolve(__dirname, '../.cache/rethinkdb/campaigns_items_choices', item + '.json'))
          _answer = item
          isURN = true
        } catch(e) {
          _answer = item
        }
        busSend({
          survey: survey.id,
          label: payload.label,
          answer: _answer,
          isURN: isURN
        }, function () {
          next2()
        })
      }, function () {
        done()
      })
    } else {
      try {
        fse.accessSync(path.resolve(__dirname, '../.cache/rethinkdb/campaigns_items_choices', payload.answer + '.json'))
        _answer = payload.answer
        isURN = true
      } catch(e) {
        _answer = payload.answer
      }
      busSend({
        survey: survey.id,
        label: payload.label,
        answer: _answer,
        isURN: isURN
      }, function () {
        next1()
      })
    }
  }, function () {
    done()
  })
}, function () {
  console.log('checksum=%s', checksum)
  console.log('===== END ===============')
  process.exit(0)
})
