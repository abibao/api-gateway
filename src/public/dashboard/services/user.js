/*global riot:false*/
class UserStore {

  constructor () {
    riot.observable(this)
    this.bindEvents()
  }

  bindEvents () {
    var self = this

    self.on(riot.EVENT.USER_AUTHENTICATE, function () {
      riot.feathers.authenticate()
        .then(function (result) {
          return self.trigger(riot.EVENT.USER_AUTHENTICATE_SUCCESS, result)
        })
        .catch(function (error) {
          return self.trigger(riot.EVENT.USER_AUTHENTICATE_FAILED, error)
        })
    })

    self.on(riot.EVENT.USER_AUTH_SEND_EMAIL, function (email) {
      riot.feathers.logout()
      var service = riot.feathers.service('v1/autologin')
      service.create({email, backUrl: 'http://localhost:8484/#autologin?fingerprint'})
        .then(function (result) {
          return self.trigger(riot.EVENT.USER_AUTH_SEND_EMAIL_SUCCESS, result)
        })
        .catch(function (error) {
          return self.trigger(riot.EVENT.USER_AUTH_SEND_EMAIL_FAILED, error)
        })
    })

    self.on(riot.EVENT.USER_CONTROL_FINGERPRINT, function (fingerprint) {
      riot.feathers.logout()
      var service = riot.feathers.service('v1/autologin')
      service.get(fingerprint)
        .then(function (result) {
          return riot.feathers.authenticate({ type: 'token', token: result.token })
        })
        .then(function (result) {
          return self.trigger(riot.EVENT.USER_CONTROL_FINGERPRINT_SUCCESS, result.data)
        })
        .catch(function (error) {
          return self.trigger(riot.EVENT.USER_CONTROL_FINGERPRINT_FAILED, error)
        })
    })
  }

}

export default new UserStore()
