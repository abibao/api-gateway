'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var async = require('async')
var jsonfile = require('jsonfile')
var path = require('path')
var child_process = require('child_process')

var recli = path.resolve(__dirname, '..', 'node_modules/recli/bin/recli.js')
var params = '-c --json ' +
'--host ' + nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST') + ' ' +
'--port ' + nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT') + ' ' +
// '--database ' + nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB') + ' ' +
'--database prodmvp' + ' ' +
'--auth ' + nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY')

var tables = ['administrators', 'individuals', 'entities', 'campaigns', 'campaigns_items', 'campaigns_items_choices', 'surveys']
async.mapSeries(tables, function (table, next) {
  console.log(table)
  var ReQL = ' \'r.table("' + table + '")\' '
  child_process.exec(recli + ' ' + params + ' ' + ReQL, function (error, stdout, stderr) {
    var file = path.resolve(__dirname, '../.cache/' + table + '.json')
    jsonfile.writeFileSync(file, JSON.parse(stdout))
    next()
  })
})

/*
r.db('prodmvp')
  .table('surveys')
  .hasFields({'answers': {'ABIBAO_ANSWER_FONDAMENTAL_GENDER': true}})
  .map(function (answer) {
    var gender = answer('answers')
    return {
      gender: gender('ABIBAO_ANSWER_FONDAMENTAL_GENDER'),
    }
  })
  .coerceTo('array')
  .merge(function (item) {
    var prefix = r.db('prodmvp').table('campaigns_items_choices').get(item('gender'))('prefix')
    var suffix = r.db('prodmvp').table('campaigns_items_choices').get(item('gender'))('suffix')
    return prefix.add('_').add(suffix)
  })
  .group(function (gender) {
    return gender
  })
  .count()
*/
