class UserStore {

  constructor () {
    riot.observable(this)
    this.bindEvents()
  }

  bindEvents () {
    this.on(riot.EVENT.USER_AUTH_SEND_EMAIL, function (email) {
      riot.feathers.logout()
      var service = riot.feathers.service('autologin')
      service.create({email, scope: 'administrator', backUrl: 'http://localhost:8484/#autologin?fingerprint'})
        .then(function (result) {
          riot.control.trigger(riot.EVENT.USER_AUTH_SEND_EMAIL_SUCCESS, result)
        })
        .catch(function (error) {
          riot.control.trigger(riot.EVENT.USER_AUTH_SEND_EMAIL_FAILED, error)
        })
    })
    this.on(riot.EVENT.USER_AUTHENTICATE, function () {
      riot.feathers.logout()
      riot.feathers.authenticate()
        .then(function (result) {
          riot.control.trigger(riot.EVENT.USER_AUTHENTICATE_SUCCESS, result.data)
        })
        .catch(function (error) {
          riot.control.trigger(riot.EVENT.USER_AUTHENTICATE_FAILED, error)
        })
    })
    this.on(riot.EVENT.USER_CONTROL_FINGERPRINT, function (fingerprint) {
      riot.feathers.logout()
      var service = riot.feathers.service('autologin')
      service.get(fingerprint)
        .then(function (result) {
          riot.feathers.authenticate({ type: 'token', token: result.token })
            .then(function (result) {
              riot.control.trigger(riot.EVENT.USER_AUTHENTICATE_SUCCESS, result.data)
            })
            .catch(function (error) {
              riot.control.trigger(riot.EVENT.USER_AUTHENTICATE_FAILED, error)
            })
        })
        .catch(function (error) {
          riot.control.trigger(riot.EVENT.USER_AUTHENTICATE_FAILED, error)
        })
    })
  }

}

// add store to riot control
let userStore = new UserStore()
riot.control.addStore(userStore)

export default userStore
