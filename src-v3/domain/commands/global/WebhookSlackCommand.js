'use strict'

const Promise = require('bluebird')
const rp = require('request-promise')
const EventEmitter = require('events').EventEmitter

class WebhookSlackCommand {
  constructor (domain) {
    this.type = 'command'
    this.name = 'webhook-slack-command'
    this.nconf = domain.nconf
    this.r = domain.databases.r
    this.domain = domain
    this.bus = new EventEmitter()
    this.bus.on('execute', (body, webhook) => {
      setImmediate(() => {
        this.handler({body, webhook})
          .then(() => {
            this.domain.debug(body, 'has been posted')
          })
          .catch((error) => {
            this.domain.error(error)
          })
      })
    })
  }
  handler (message) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        uri: message.webhook,
        body: message.body,
        json: true
      }
      return rp(options)
    })
  }
}

module.exports = WebhookSlackCommand
