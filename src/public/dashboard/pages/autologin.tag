import userService from './../services/user'

import './../components/s-header.tag'

<autologin>

  <s-header></s-header>

  <script>

    let self = this

    self.on('mount', function() {
      const q = riot.route.query()
      const fingerprint = q.fingerprint
      userService.trigger(riot.EVENT.USER_CONTROL_FINGERPRINT, fingerprint);
    })

    userService.on(riot.EVENT.USER_CONTROL_FINGERPRINT_SUCCESS, function(user) {
      riot.route('homepage')
    })

    userService.on(riot.EVENT.USER_CONTROL_FINGERPRINT_FAILED, function(error) {
      riot.route('login')
    })

  </script>

  <style scoped>
  </style>

</autologin>
