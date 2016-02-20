<navbar>
  
  <nav class="grey lighten-5 z-depth-1">
    <div class="container">
      <div class="nav-wrapper">
        <a onclick={ homepageHandler } href="#" class="brand-logo blue-grey-text text-darken-2">HOMEPAGE</a>
        <ul class="right hide-on-med-and-down">
          <li if={ !authentified && facade.currentState!==Facade.STATE_LOGIN }><a class="waves-effect waves-light btn light-green darken-2" onclick={ loginHandler }>Login</a></li>
          <li if={ authentified && facade.currentState!==Facade.STATE_LOGIN }><a class="waves-effect waves-light btn red lighten-2" onclick={ logoutHandler }>Logout</a></li>
          <li if={ facade.currentState===Facade.STATE_LOGIN }><a class="waves-effect waves-light btn blue-grey darken-2" onclick={ homepageHandler }>Retour</a></li>
        </ul>
      </div>
    </div>
  </nav>
  
  <script>
    
    var self = this;
    self.name = 'navbar';
    
    self.on('mount', function() {
      console.log(self.name, 'mount');
      facade.tags[self.name] = self;
      if ( _.keys(facade.tags).length===Facade.Tags ) facade.start();
    });
    
    self.on('update', function() {
      console.log(self.name, 'update');
      self.Authentification = Cookies.get('Authentification');
      self.authentified = self.Authentification!==undefined;
      self.update();
    });
    
    self.on('ready', function() {
      console.log(self.name, 'ready');
      self.Authentification = Cookies.get('Authentification');
      self.authentified = self.Authentification!==undefined;
      self.update();
    });
    
    logoutHandler(e) {
      Cookies.remove('Authentification');
      riot.route('/homepage');
    }
    
    loginHandler(e) {
      riot.route('/login');
    }
    
    homepageHandler(e) {
      riot.route('/homepage');
    }
    
  </script>
  
  <style scoped>
    
    a.btn {
      width: 150px;
    }
    
  </style>
  
</navbar>