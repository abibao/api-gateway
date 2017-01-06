'use strict'

const args = process.argv.slice(2)

const glob = require('glob')
const async = require('async')
const path = require('path')
const fse = require('fs-extra')
const colors = require('colors/safe')
const rp = require('request-promise')
const ProgressBar = require('progress')

const patternPath = path.resolve(args[0], 'entities', '*.json')

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

console.log(colors.yellow.bold('***** ENTITIES *****'))

async.mapSeries(files, (filepath, next) => {
  const entity = fse.readJsonSync(filepath)
  let options = {
    method: 'POST',
    body: entity,
    uri: 'http://localhost:8383/batchs/entities',
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
    console.log('\n', colors.bgRed.bold(' ERROR! '))
    console.log(err)
    process.exit(1)
  } else {
    console.log('\n', colors.bgGreen.bold(' DONE! '), '\n')
    process.exit(0)
  }
})
