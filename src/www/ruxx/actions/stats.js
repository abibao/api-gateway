function StatsActions (facade) {
  var self = this
  self.facade = facade

  self.charitiesIndividuals = function () {
    return new Promise(function (resolve, reject) {
      self.facade.setLoading(true)
      self.facade.call('GET', '/v1/stats/chatities/individuals')
        .then(function (stats) {
          var data = lodash.map(stats, function (stat) {
            return stat.count
          })
          var labels = lodash.map(stats, function (stat) {
            return stat.charity.name
          })
          self.facade.stores.stats._countMembersInEntities.datasets[0].data = data
          self.facade.stores.stats._countMembersInEntities.labels = labels
          self.facade.debugAction('StatsActions.charitiesIndividuals %o', stats)
          self.facade.setLoading(false)
          resolve(stats)
        })
        .catch(function (error) {
          self.facade.setLoading(false)
          self.facade.debugAction('StatsActions.charitiesIndividuals (ERROR) %o', error)
          self.facade.trigger('EVENT_CALLER_ERROR', error)
          reject(error)
        })
    })
  }

  self.individualsGenders = function () {
    return new Promise(function (resolve, reject) {
      self.facade.setLoading(true)
      self.facade.call('GET', '/v1/stats/individuals/genders')
        .then(function (stats) {
          self.facade.stores.stats._countGendersInAbibao.datasets[0].data = [stats.men, stats.women]
          self.facade.debugAction('StatsActions.individualsGenders %o', stats)
          self.facade.setLoading(false)
          resolve(stats)
        })
        .catch(function (error) {
          self.facade.setLoading(false)
          self.facade.debugAction('StatsActions.individualsGenders (ERROR) %o', error)
          self.facade.trigger('EVENT_CALLER_ERROR', error)
          reject(error)
        })
    })
  }

  self.individualsAges = function (gender) {
    return new Promise(function (resolve, reject) {
      self.facade.setLoading(true)
      self.facade.call('GET', '/v1/stats/individuals/ages/' + gender)
        .then(function (stats) {
          self.facade.stores.stats._countMembersAges.datasets[0].data = stats.data
          self.facade.stores.stats._countMembersAges.labels = ['0-4', '5-14', '15-24', '25-34', '35-44', '45-54', '55-64', '65-74', '75-84', '85-94']
          self.facade.debugAction('StatsActions.individualsAges %o', stats)
          self.facade.setLoading(false)
          resolve(stats)
        })
        .catch(function (error) {
          self.facade.setLoading(false)
          self.facade.debugAction('StatsActions.individualsAges (ERROR) %o', error)
          self.facade.trigger('EVENT_CALLER_ERROR', error)
          reject(error)
        })
    })
  }
}
