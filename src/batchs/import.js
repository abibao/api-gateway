'use strict'

const args = process.argv.slice(2)

const glob = require('glob')
const async = require('async')
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
    const campaign = fse.readJsonSync(filepath)
    let options = {
      method: 'POST',
      headers: {
        'Authorization': token
      },
      body: campaign,
      uri: 'http://localhost:8383/v2/' + tableName,
      json: true
    }
    rp(options)
      .then(() => {
        bar.tick()
        next()
      })
      .catch(() => {
        // TOTO : error in a file ?
        bar.tick()
        next()
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
