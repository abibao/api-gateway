import './../components/header.tag'

<homepage>

  <header></header>
  <div class="page" if={ loading===false }>

  </div>

  <script>

    let self = this

    self.loading = true

    self.on('mount', function() {
      console.log('homepage.tag > mount()')
      riot.control.trigger(riot.EVENT.USER_AUTHENTICATE)
    })

    riot.control.on(riot.EVENT.USER_AUTHENTICATE_SUCCESS, function(user) {
      console.log('homepage.tag > USER_AUTHENTICATE_SUCCESS', user)
      self.loading = false
      self.update()
    })
    
    riot.control.on(riot.EVENT.USER_AUTHENTICATE_FAILED, function(error) {
      console.log('homepage.tag > USER_AUTH_SEND_EMAIL_FAILED', error)
      self.loading = false
      riot.route('login')
    })

  </script>

  <style scoped>

  </style>

</homepage>
