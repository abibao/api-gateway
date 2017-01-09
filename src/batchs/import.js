'use strict'

const args = process.argv.slice(2)

const Promise = require('bluebird')
const glob = require('glob')
const async = require('async')
const _ = require('lodash')
const path = require('path')
const fse = require('fs-extra')
const colors = require('colors/safe')
const rp = require('request-promise')
const ProgressBar = require('progress')
const prompt = require('prompt')

console.log('')
console.log('Veuillez saisir vos codes administrateur !')
prompt.start()
prompt.get(['email', 'password'], function (error, result) {
  result.email = 'gilles@abibao.com'
  result.password = 'azer1234'
  if (error) {
    console.log('\n', colors.bgRed.bold(' ERROR! '), '\n')
    console.log(error)
    process.exit(1)
  } else {
    console.log('')
    rp({
      method: 'POST',
      body: {
        email: result.email,
        password: result.password
      },
      uri: 'http://localhost:8383/v1/administrators/login',
      json: true
    })
    .then((auth) => {
      async.mapSeries(args[1].split(','), (tableName, next) => {
        batch(tableName, auth.token, next)
      })
    })
    .catch((error) => {
      console.log('\n', colors.bgRed.bold(' ERROR! '), '\n')
      console.log(error.message)
      process.exit(1)
    })
  }
})

const batch = (tableName, token, callback) => {
  const patternPath = path.resolve(args[0], tableName.replace(/-/gi, '_'), '*.json')
  const files = glob.sync(patternPath, {
    nodir: true,
    dot: true,
    ignore: ['index.js']
  })
  var bar = new ProgressBar('progress [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: files.length
  })

  console.log(colors.yellow.bold('*****', tableName, files.length, '*****'))

  async.mapSeries(files, (filepath, next) => {
    const data = fse.readJsonSync(filepath)
    let promises = []
    // hooks before
    if (tableName === 'campaigns') {
      data.EntityId = data.company
    }
    if (tableName === 'campaigns-items') {
      data.CampaignId = data.campaign
    }
    if (tableName === 'campaigns-items-choices') {
      data.CampaignId = data.campaign
      data.CampaignItemId = data.item
    }
    // insert into
    promises.push(rp({
      method: 'POST',
      headers: {
        'Authorization': token
      },
      body: data,
      uri: 'http://localhost:8383/v2/' + tableName,
      json: true
    }))
    // hooks after
    if (tableName === 'surveys') {
      _.map(Object.keys(data.answers), (question) => {
        if (_.isArray(data.answers[question])) {
          _.map(data.answers[question], (answer) => {
            let _data = {
              survey: data.id,
              question,
              answer
            }
            promises.push(rp({
              method: 'POST',
              headers: {
                'Authorization': token
              },
              body: _data,
              uri: 'http://localhost:8383/v2/surveys-answers',
              json: true
            }))
          })
        } else {
          let _data = {
            survey: data.id,
            question,
            answer: data.answers[question]
          }
          promises.push(rp({
            method: 'POST',
            headers: {
              'Authorization': token
            },
            body: _data,
            uri: 'http://localhost:8383/v2/surveys-answers',
            json: true
          }))
        }
      })
    }
    Promise.all(promises)
      .then(() => {
        bar.tick()
        next()
      })
      .catch((error) => {
        bar.tick()
        console.log('\n', error.message)
        console.log(error.options.body)
        next(error)
      })
  }, (err, results) => {
    if (err) {
      console.log('\n', colors.bgRed.bold(' ERROR! '), '\n')
      callback(err)
    } else {
      console.log('\n', colors.bgGreen.bold(' DONE! '), '\n')
      callback()
    }
  })
}
