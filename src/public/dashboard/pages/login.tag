import userService from './../services/user'

import './../components/s-header.tag'

<login>

  <div class="valign-wrapper">
    <div class="container">
      <div class="card" if={ loading===false }>
        <div class="col title s12 blue lighten-abibao">
          <h4 class="white-text">Vérification de votre identité</h4>
          <p class="white-text">Pour valider votre identité nous allons vous envoyer un lien par email, simple et efficace.</p>
        </div>
        <div class="col content s12 grey lighten-abibao">
          <input id="email" type="email" placeholder="Saissisez votre email"></input>
          <a onclick={ sendEmailHandler } class="waves-effect waves-light btn-large white blue-text text-lighten-abibao">Envoyer</a>
        </div>
      </div>
    </div>
  </div>

  <script>

    let self = this

    self.loading = true

    self.on('mount', function() {
      userService.trigger(riot.EVENT.USER_AUTHENTICATE)
    })

    self.on('unmount', function() {
    })

    userService.on(riot.EVENT.USER_AUTHENTICATE_SUCCESS, function(user) {
      riot.route('homepage')
    })

    userService.on(riot.EVENT.USER_AUTHENTICATE_FAILED, function(error) {
      self.loading = false
      self.update()
    })

    self.sendEmailHandler = function(e) {
      self.loading = true
      self.update()
      userService.trigger(riot.EVENT.USER_AUTH_SEND_EMAIL, self.email.value)
    }

    userService.on(riot.EVENT.USER_AUTH_SEND_EMAIL_SUCCESS, function(result) {
      self.loading = false
      self.update()
    })

    userService.on(riot.EVENT.USER_AUTH_SEND_EMAIL_FAILED, function(error) {
      self.loading = false
      self.update()
    })

  </script>

  <style scoped>
    .valign-wrapper {
      height: 100%;
    }
    .container {
      width: 650px;
    }
    .col.title {
      padding: 1rem;
      text-align: center;
      margin-bottom: 0;
    }
    .col.title p {
      margin-top: -1rem;
    }
    .col.content input[type=email] {
      border-bottom: 1px solid #ffffff;
      background: #ffffff;
      padding: 0.25rem;
    }
    .col.content input[type=email]:focus {
      border-bottom: 1px solid #5da2c7;
      box-shadow: 0 1px 0 0 #5da2c7;
    }
    .col.content {
      padding: 2rem;
    }
  </style>

</login>
