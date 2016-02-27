<login if={ facade.getCurrentState()===Facade.STATE_LOGIN }> 
  
  <div class="row"> </div>
  
  <div class="row">
    <div class="col s12 m8 offset-m2 l6 offset-l3">
      <div class="card grey lighten-5 z-depth-1">
        <div class="card-content blue-grey-text text-darken-2">
          <h4>Authentification</h4>
          <input id="email" value="gilles@abibao.com" autocomplete="off" class="fit-parent form" type="email" placeholder="Votre email">
          <input id="password" value="azer1234" autocomplete="off" class="fit-parent form" type="password" placeholder="Votre mot de passe">
          <div class="row"> </div>
          <p><a class="waves-effect waves-light btn blue-grey darken-2" onclick={ submitHandler }>Connexion</a></p>
          <div class="row"> </div>
          <p>Munissez-vous des informations fournies par l"équipe administrative de ABIBAO. Pour toutes questions concernant votre compte, veuillez contacter <a href="mailto:administrateur@abibao.com">administrateur@abibao.com</a>.</p>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    
    var self = this;
    self.name = "login";

    self.on("mount", function() {
      console.log(self.name, "mount");
      facade.tags[self.name] = self;
      if ( _.keys(facade.tags).length===Facade.Tags ) facade.start();
    });
    
    self.on("update", function() {
      console.log(self.name, "update");
      if ( facade.authentified() ) riot.route("/homepage");
    });
    
    submitHandler(e) {
      var payload = { email:self.email.value, password:self.password.value };
      socket.emit("urn:socket:get:/v1/administrators/login", payload); 
    }
    
    socket.on("response:socket:get:/v1/administrators/login", function(data) {
      if ( data.error ) {
        return;
      }
      if ( !data.token ) {
        return;
      }
      Cookies.set("Authentification", data.token);
      riot.update();
    });
    
  </script>
  
  <style scoped>
    input[type=email]:focus:not([readonly]), 
    input[type=password]:focus:not([readonly]) {
      border-bottom: 1px solid #455a64;
      box-shadow: 0 1px 0 0 #607d8b;
    }
  </style>
  
</login>