import userService from './../services/user'

import './../components/s-header.tag'

<homepage>

  <s-header></s-header>
  <div class="page" if={ loading===false }>
  </div>

  <script>

    let self = this

    self.loading = true

    self.on('mount', function() {
      userService.trigger(riot.EVENT.USER_AUTHENTICATE)
    })

    userService.on(riot.EVENT.USER_AUTHENTICATE_SUCCESS, function(user) {
      console.log(user)
      self.loading = false
      self.update()
    })

    userService.on(riot.EVENT.USER_AUTHENTICATE_FAILED, function(error) {
      self.loading = false
      riot.route('login')
    })

  </script>

  <style scoped>
  </style>

</homepage>
