'use strict'

var config = require('../../config')

module.exports = {
  level: 'info',
  type: 'raw',
  stream: require('bunyan-logstash-tcp').createStream({
    host: config('ABIBAO_API_GATEWAY_LOGSTASH_HOST'),
    port: config('ABIBAO_API_GATEWAY_LOGSTASH_PORT')
  })
}
