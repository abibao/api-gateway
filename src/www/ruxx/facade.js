function Facade () {
  var self = this
  riot.observable(self)

  self.version = '2.6.8'
  self.baseapi = window.location.origin

  self.debug = debug('abibao:facade')
  self.debugCall = debug('abibao:facade:call')
  self.debugAction = debug('abibao:facade:action')
  self.debugHTML = debug('abibao:html')

  self.stores = {
    auth: new AuthStore(),
    entities: new EntitiesStore(),
    stats: new StatsStore()
  }
  self.actions = {
    auth: new AuthActions(self),
    campaigns: new CampaignsActions(self),
    entities: new EntitiesActions(self),
    stats: new StatsActions(self)
  }

  /** CURRENT CAMPAIGN ITEM CHOICE **/
  self._currentCampaignItemChoice = null
  self.getCurrentCampaignItemChoice = function () {
    return self._currentCampaignItemChoice
  }
  self.setCurrentCampaignItemChoice = function (value) {
    self.debug('setCurrentCampaignItemChoice %o', value)
    self._currentCampaignItemChoice = lodash.clone(value)
    riot.update()
  }

  /** CURRENT CAMPAIGN ITEM **/
  self._currentCampaignItem = null
  self.getCurrentCampaignItem = function () {
    return self._currentCampaignItem
  }
  self.setCurrentCampaignItem = function (value) {
    self.debug('setCurrentCampaignItem %o', value)
    self._currentCampaignItem = lodash.clone(value)
    riot.update()
  }

  /** CURRENT CAMPAIGN **/
  self._currentCampaign = null
  self.getCurrentCampaign = function () {
    return self._currentCampaign
  }
  self.setCurrentCampaign = function (value) {
    self.debug('setCurrentCampaign %o', value)
    self._currentCampaign = lodash.clone(value)
    riot.update()
  }

  /** CURRENT ENTITY **/
  self._currentEntity = null
  self.getCurrentEntity = function () {
    return self._currentEntity
  }
  self.setCurrentEntity = function (value) {
    self.debug('setCurrentEntity %o', value)
    self._currentEntity = lodash.clone(value)
    riot.update()
  }

  self.initialize = function () {
    // start sequence
    self.actions.entities.list()
      .then(function () {
        return self.actions.stats.charitiesIndividuals()
      })
      .then(function (stats) {
        var _stats = {}
        lodash.map(stats, function (stat) {
          _stats[stat.charity.urn] = stat
        })
        self.debugAction('stats=%o', _stats)
        lodash.map(self.stores.entities.charities, function (item) {
          item.members = _stats[item.urn].count
        })
        return self.actions.stats.individualsGenders()
      })
      .then(function () {
        return self.actions.stats.individualsAges('MALE')
      })
      .then(function () {
        return self.actions.stats.individualsAges('FEMALE')
      })
      .then(function () {
        self.debug('start facade authentified=%s', self.stores.auth.authentified())
        riot.update()
      })
      .catch(function (error) {
        self.debug('start facade error %o', error)
      })
  }

  self.call = function (method, url, payload) {
    if (payload) { delete payload.published }
    self.debugCall('new promise %s %s %o', method, url, payload)
    self.setLoading(true)
    return new Promise(function (resolve, reject) {
      // Headers
      $.ajaxSetup({
        contentType: 'application/json',
        dataType: 'json',
        headers: {
          'Authorization': Cookies.get('USER-TOKEN')
        }
      })
      $.ajax({
        method: method,
        url: url,
        data: JSON.stringify(payload)
      })
        .fail(function (error) {
          self.debugCall('error %s %s %o', method, url, error)
          return reject(error)
        })
        .done(function (data, status, xhr) {
          self.debugCall('complete %s %s %o', method, url, data)
          if (data.csrf) {
            Cookies.set('CSRF-TOKEN', data.csrf)
          }
          riot.update()
          return resolve(data)
        })
    })
  }

  self._loading = false
  self.setLoading = function (value) {
    self._loading = value
    riot.update()
  }
  self.getLoading = function () {
    return self._loading
  }

  self.on('EVENT_CALLER_ERROR', function (error) {
    self.debug('EVENT_CALLER_ERROR %o', error.responseJSON)
    UIkit.notify({
      message: error.responseJSON.message,
      status: 'danger',
      timeout: 4000,
      pos: 'top-center'
    })
  })
}
