'use strict'

const nconf = require('nconf').argv().env().file({ file: 'nconf-rece.json' })
const r = require('rethinkdbdash')({
  host: nconf.get('RETHINKDB_ENV_DOCKERCLOUD_SERVICE_FQDN'),
  port: nconf.get('RETHINKDB_PORT_28015_TCP_PORT'),
  user: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_USER'),
  password: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PASSWORD'),
  silent: true
})

r.db('recemvp')
  .table('surveys')
  .merge(function (item) {
    return {
      abibao: r.db('recemvp').table('entities').get(item('company'))('type').eq('abibao'),
      campaign_name: r.db('recemvp').table('campaigns').get(item('campaign'))('name'),
      company_name: r.db('recemvp').table('entities').get(item('company'))('name'),
      questions: r.db('recemvp').table('campaigns_items').filter({campaign: item('campaign')}).count(),
      responses: item('answers').keys().count()
    }
  })
  .merge(function (item) {
    return {
      complete: item('responses').eq(item('questions')),
      progress: r.expr(item('responses')).div(item('questions')).mul(100)
    }
  })
  .run()
  .then((result) => {
    console.log(result)
  })
  .catch((error) => {
    console.log(error)
  })
