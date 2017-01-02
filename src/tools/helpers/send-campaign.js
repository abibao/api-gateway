'use strict'

const path = require('path')

const LineByLineReader = require('line-by-line')
const async = require('async')
const rp = require('request-promise')
const colors = require('colors')

const filepath = path.resolve(__dirname, 'FILENAME.txt')
const lr = new LineByLineReader(filepath)

let emails = []
console.log('***** START *****')
lr.on('line', function (line) {
  emails.push(line)
})
lr.on('end', function () {
  async.mapSeries(emails, function (email, next) {
    const options = {
      method: 'POST',
      headers: {
        authorization: 'TOKEN_ADMIN_TO_INSERT'
      },
      body: {
        email
      },
      uri: 'https://api.abibao.com/v1/campaigns/{URN_CAMPAIGN}/affect',
      json: true
    }
    rp(options)
      .then(() => {
        console.log(colors.green.bold(options.body.email, 'has been sended'))
        next()
      })
      .catch((error) => {
        console.log(colors.red.bold(options.body.email, error.message))
        next()
      })
  }, () => {
    console.log('***** FINISH *****')
  })
})
