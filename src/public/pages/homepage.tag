import userService from './../services/user'
import individualsService from './../services/individuals'

import './../components/header.tag'

<homepage>

  <header></header>
  <div class="page" if={ loading===false }>
    <div class="card">
      <h2>individuals: { individuals.total }</h2>
    </div>
  </div>

  <script>

    let self = this

    self.loading = true
    self.individuals = {
      total: 0,
      data: []
    };

    self.on('mount', function() {
      console.log('homepage.tag > mount()')
      userService.trigger(riot.EVENT.USER_AUTHENTICATE)
    })

    userService.on(riot.EVENT.USER_AUTHENTICATE_SUCCESS, function(user) {
      console.log('homepage.tag > USER_AUTHENTICATE_SUCCESS', user)
      self.loading = false
      self.update()
      individualsService.trigger(riot.EVENT.SERVICE_INDIVIDUALS_FIND)
    })

    userService.on(riot.EVENT.USER_AUTHENTICATE_FAILED, function(error) {
      console.log('homepage.tag > USER_AUTH_SEND_EMAIL_FAILED', error)
      self.loading = false
      riot.route('login')
    })

    individualsService.on(riot.EVENT.SERVICE_INDIVIDUALS_FIND_SUCCESS, function(result) {
      console.log('homepage.tag > SERVICE_INDIVIDUALS_FIND_SUCCESS', result)
      self.loading = false
      self.individuals = result
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
    h2, p {
      color: #555459;
    }
  </style>

</homepage>
