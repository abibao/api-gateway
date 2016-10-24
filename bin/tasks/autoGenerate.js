'use strict'

// Promise
var Promise = require('bluebird')

// declare internal libraries
var async = require('async')

// declare external libraries
// ...

// declare project libraries
var error = require('./../console').error
var notice = require('./../console').notice
var warning = require('./../console').warning

var errorPromised = function (e) {
  error(e)
}

module.exports = function () {
  warning('Task: ', 'Create')
  warning('***********************************************************************')

  try {
    warning('START sequence')
    warning('***********************************************************************')

    var sequenceItems = [
      {
        table: 'entities',
        collection: 'Entities',
        model: 'Entity'
      },
      {
        table: 'surveys',
        collection: 'Surveys',
        model: 'Survey'
      },
      {
        table: 'campaigns',
        collection: 'Campaigns',
        model: 'Campaign'
      },
      {
        table: 'campaigns_items',
        collection: 'CampaignsItems',
        model: 'CampaignItem'
      },
      {
        table: 'campaigns_items_choices',
        collection: 'CampaignsItemsChoices',
        model: 'CampaignItemChoice'
      },
      {
        table: 'individuals',
        collection: 'Individuals',
        model: 'Individual'
      },
      {
        table: 'administrators',
        collection: 'Administrators',
        model: 'Administrator'
      }
    ]

    async.mapSeries(sequenceItems, function (item, next) {
      var table = item.table
      var collection = item.collection
      var model = item.model

      notice('[x] table ', table)
      notice('[x] collection ', collection)
      notice('[x] model ', model)
      warning('***********************************************************************')

      var Sequence = require('./../templates/sequence')
      var sequence = new Sequence(model, collection)
      Promise.all(sequence).catch(errorPromised)
      next()
    }, function () {
      warning('END sequence')
      warning('***********************************************************************')
    })
  } catch (e) {
    error(e)
    return process.exit(1)
  }
}
