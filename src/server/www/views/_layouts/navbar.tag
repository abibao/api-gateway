<navbar>
  
  <nav class="grey lighten-5 z-depth-1">
    <div class="container">
      <div class="nav-wrapper">
        <a onclick={ homepageHandler } href="#" class="brand-logo blue-grey-text text-darken-2">HOMEPAGE</a>
        <ul class="right hide-on-med-and-down">
          <li if={ !facade.stores.auth.authentified() && facade.getCurrentState()!==Facade.STATE_LOGIN }><a class="waves-effect waves-light btn light-green darken-2" onclick={ loginHandler }>Login</a></li>
          <li if={ facade.stores.auth.authentified() && facade.getCurrentState()!==Facade.STATE_LOGIN }><a class="waves-effect waves-light btn deep-orange darken-3" onclick={ logoutHandler }>Logout</a></li>
          <li if={ facade.getCurrentState()===Facade.STATE_LOGIN }><a class="waves-effect waves-light btn blue-grey darken-2" onclick={ homepageHandler }>Retour</a></li>
        </ul>
      </div>
    </div>
  </nav>
  
  <script>
    
    var self = this;
    self.name = "navbar";
    
    self.on("mount", function() {
      facade.tags[self.name] = self;
    });
    
    self.on("update", function() {
    });
    
    logoutHandler(e) {
      Cookies.remove("Authorization");
      riot.update();
      riot.route("/homepage");
    }
    
    loginHandler(e) {
      riot.route("/login");
    }
    
    homepageHandler(e) {
      riot.route("/homepage");
    }
    
  </script>
  
  <style scoped>
    
    a.btn {
      width: 150px;
    }
    
  </style>
  
</navbar>