function StatsActions (facade) {
  var self = this
  self.facade = facade

  self.countMembersInEntities = function () {
    return new Promise(function (resolve, reject) {
      self.facade.setLoading(true)
      self.facade.call('GET', '/v1/stats/chatities/individuals')
        .then(function (stats) {
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
}
