'use strict'

const authentication = require('./authentication')
const autologin = require('./domains/autologin')
const individuals = require('./databases/individuals')
const campaigns = require('./databases/campaigns')
const campaignItems = require('./databases/campaign-items')
const campaignItemChoices = require('./databases/campaign-item-choices')
const entities = require('./databases/entities')
const surveys = require('./databases/surveys')
const user = require('./memory/user')
const authSurvey = require('./domains/auth/survey')

module.exports = function () {
  const app = this

  app.configure(authentication)
  app.configure(autologin)
  app.configure(individuals)
  app.configure(campaigns)
  app.configure(campaignItems)
  app.configure(campaignItemChoices)
  app.configure(entities)
  app.configure(surveys)
  app.configure(user)
  app.configure(authSurvey)
}
