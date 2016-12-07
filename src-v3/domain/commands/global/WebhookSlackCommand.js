'use strict'

const Promise = require('bluebird')
const rp = require('request-promise')

class WebhookSlackCommand {
  constructor (domain) {
    this.type = 'command'
    this.name = 'webhook-slack-command'
    this.nconf = domain.nconf
    this.r = domain.databases.r
    this.domain = domain
  }
  handler (message) {
    return new Promise((resolve) => {
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
