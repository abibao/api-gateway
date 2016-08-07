import userService from './../services/user'

import './../components/header.tag'

<autologin>

  <header></header>

  <script>

    let self = this

    self.on('mount', function() {
      console.log('autologin.tag > mount()')
      const q = riot.route.query()
      const fingerprint = q.fingerprint
      userService.trigger(riot.EVENT.USER_CONTROL_FINGERPRINT, fingerprint);
    })

    userService.on(riot.EVENT.USER_CONTROL_FINGERPRINT_SUCCESS, function(user) {
      console.log('autologin.tag > USER_CONTROL_FINGERPRINT_SUCCESS', user)
      riot.route('homepage')
    })

    userService.on(riot.EVENT.USER_CONTROL_FINGERPRINT_FAILED, function(error) {
      console.log('autologin.tag > USER_CONTROL_FINGERPRINT_FAILED', error)
      riot.route('login')
    })

  </script>

</autologin>
