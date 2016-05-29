function StatsActions (facade) {
  var self = this
  self.facade = facade

  self.countMembersInEntities = function () {
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
          self.facade.debugAction('StatsActions.countMembersInEntities %o', stats)
          self.facade.setLoading(false)
          resolve(stats)
        })
        .catch(function (error) {
          self.facade.setLoading(false)
          self.facade.debugAction('StatsActions.countMembersInEntities (ERROR) %o', error)
          self.facade.trigger('EVENT_CALLER_ERROR', error)
          reject(error)
        })
    })
  }

  self.countGendersInAbibao = function () {
    return new Promise(function (resolve, reject) {
      self.facade.setLoading(true)
      self.facade.call('GET', '/v1/stats/individuals/count')
        .then(function (stats) {
          self.facade.stores.stats._countGendersInAbibao.datasets[0].data = [stats.men, stats.women]
          self.facade.debugAction('StatsActions.countGendersInAbibao %o', stats)
          self.facade.setLoading(false)
          resolve(stats)
        })
        .catch(function (error) {
          self.facade.setLoading(false)
          self.facade.debugAction('StatsActions.countGendersInAbibao (ERROR) %o', error)
          self.facade.trigger('EVENT_CALLER_ERROR', error)
          reject(error)
        })
    })
  }
}
