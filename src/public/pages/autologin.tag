import './../components/header.tag'

<autologin>

  <header></header>

  <script>

    let self = this

    self.on('mount', function() {
      const q = riot.route.query()
      const fingerprint = q.fingerprint
      console.log('autologin.tag > mount()')
      riot.control.trigger(riot.EVENT.USER_CONTROL_FINGERPRINT, fingerprint);
    })

  </script>

</autologin>
