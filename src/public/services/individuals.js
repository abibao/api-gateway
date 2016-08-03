/*global riot:false*/
class IndividualsStore {

  constructor () {
    riot.observable(this)
    this.bindEvents()
  }

  bindEvents () {
    var self = this

    self.on(riot.EVENT.SERVICE_INDIVIDUALS_FIND, function () {
      console.log('IndividualsStore', 'SERVICE_INDIVIDUALS_FIND')
      var service = riot.feathers.service('v1/individuals')
      service.find()
        .then(function (result) {
          console.log('IndividualsStore', 'SERVICE_INDIVIDUALS_FIND_SUCCESS')
          return self.trigger(riot.EVENT.SERVICE_INDIVIDUALS_FIND_SUCCESS, result)
        })
        .catch(function (error) {
          console.log('IndividualsStore', 'SERVICE_INDIVIDUALS_FIND_FAILED')
          return self.trigger(riot.EVENT.SERVICE_INDIVIDUALS_FIND_FAILED, error)
        })
    })
  }

}

export default new IndividualsStore()
