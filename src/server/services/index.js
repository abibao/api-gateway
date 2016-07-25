'use strict'

const authentication = require('./authentication')
const autologin = require('./domains/autologin')
const individuals = require('./databases/individuals')
const campaigns = require('./databases/campaigns')
const campaignItems = require('./databases/campaign-items')
const entities = require('./databases/entities')
const user = require('./memory/user')

module.exports = function () {
  const app = this

  app.configure(authentication)
  app.configure(autologin)
  app.configure(individuals)
  app.configure(campaigns)
  app.configure(campaignItems)
  app.configure(entities)
  app.configure(user)
}
