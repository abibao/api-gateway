'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')
var async = require('async')

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    try {
      self.r.table('campaigns').get(self.getIDfromURN(payload.urn)).then(function (campaign) {
        // TODO :: if ( campaign.publish===true ) return reject("campaign already published")
        campaign.publish = true
        campaign.urn = payload.urn
        return self.execute('command', 'campaignUpdateCommand', campaign).then(function (updated) {
          return self.r.table('individuals').filter({}).hasFields(['charity']).then(function (individuals) {
            async.map(individuals, function (individual, next) {
              next()
              /* var data = {
                individual: individual.id,
                charity: individual.charity,
                email: individual.email,
                campaign: campaign.id,
                company: campaign.company
              }
              if (_.isUndefined(individual.charity)) {
              } else {
                self.individualSendEmailCampaignEvent(data)
              } */
              next()
            }, function (err) {
              if (err) { reject(err) }
              resolve(updated)
            })
          })
        })
      })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}