import userService from './../services/user'

import './../components/header.tag'

<login>

  <header></header>
  <div class="page" if={ loading===false }>
    <div class="card">
      <h1>Vérification de votre identité</h1>
      <input id="email" type="email" placeholder="Saissisez votre email"></input><br/>
      <button onclick={ sendEmailHandler } type="submit">Envoyer</button>
      <p>Pour valider votre identité nous allons vous envoyer un lien par email, simple et efficace.</p>
    </div>
  </div>

  <script>

    let self = this

    self.loading = true

    self.on('mount', function() {
      console.log('login.tag > mount()')
      userService.trigger(riot.EVENT.USER_AUTHENTICATE)
    })

    self.on('unmount', function() {
      console.log('login.tag > unmount()')
    })

    userService.on(riot.EVENT.USER_AUTHENTICATE_FAILED, function(error) {
      console.log('login.tag > USER_AUTHENTICATE_FAILED', error)
      self.loading = false
      self.update()
    })

    self.sendEmailHandler = function(e) {
      console.log('login.tag > sendEmailHandler()', self.email.value)
      self.loading = true
      self.update()
      userService.trigger(riot.EVENT.USER_AUTH_SEND_EMAIL, self.email.value)
    }

    userService.on(riot.EVENT.USER_AUTHENTICATE_SUCCESS, function(user) {
      console.log('login.tag > USER_AUTHENTICATE_SUCCESS', user)
      riot.route('homepage')
    })


    userService.on(riot.EVENT.USER_AUTH_SEND_EMAIL_SUCCESS, function(result) {
      console.log('login.tag > USER_AUTH_SEND_EMAIL_SUCCESS', result)
      self.loading = false
      self.update()
    })

    userService.on(riot.EVENT.USER_AUTH_SEND_EMAIL_FAILED, function(error) {
      console.log('login.tag > USER_AUTH_SEND_EMAIL_FAILED', error)
      self.loading = false
      self.update()
    })

  </script>

  <style scoped>
    .page {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }
    .card {
      background-color: #fff;
      border-radius: .25rem;
      box-shadow: 0 1px 0 rgba(0,0,0,.25);
      padding: 2rem 2rem 1rem;
      margin: 0 auto 2rem;
      margin-top: 120px;
      position: relative;
      border: 1px solid #e8e8e8;
      display: flex;
      flex-direction: column;
      width: 500px;
    }
    h1, p {
      color: #555459;
    }
    input[type="email"] {
      border: 1px solid #c5c5c5;
      font-family: Lato;
      font-size: 1.25rem;
      line-height: normal;
      padding: .75rem;
      border-radius: .25rem;
      color: #555459;
      box-shadow: none;
      height: auto;
    }
    input[type="email"]:focus {
      border: 1px solid #5da2c7;
    }
    button {
      width: 250px;
      background:#3aa3e3;
      color:#ffffff;
      font-family: Lato;
      font-size: 1.25rem;
      line-height: normal;
      padding: .75rem;
      cursor: pointer;
      text-shadow: 0 1px 1px rgba(0,0,0,.1);
      border: none;
      border-radius: .25rem;
      box-shadow: none;
      position: relative;
      display: inline-block;
      vertical-align: bottom;
      text-align: center;
      white-space: nowrap;
      margin: 0;
      -webkit-appearance: none;
      -webkit-tap-highlight-color: transparent;
    }
  </style>

</login>
