<homepage if={ facade.currentState===Facade.STATE_HOMEPAGE }>

  <div class="row"> </div>
  
  <div class="row">
    <div class="col s12">
      <div class="card grey lighten-5 z-depth-1">
        <div class="card-content blue-grey-text text-darken-2">
          <h4 class="blue-grey-text text-darken-2">Les associations</h4>
          <span class="blue-grey-text text-darken-2">Circa hos dies Lollianus primae lanuginis adulescens, Lampadi filius ex praefecto, exploratius causam Maximino spectante, convictus codicem noxiarum artium nondum per aetatem firmato consilio descripsisse, exulque mittendus, ut sperabatur, patris inpulsu provocavit ad principem, et iussus ad eius comitatum duci, de fumo, ut aiunt, in flammam traditus Phalangio Baeticae consulari cecidit funesti carnificis manu.</span>
        </div>
      </div>
    </div>
  </div>
  
  <div class="row">
    <div class="col">
      <div class="card small z-depth-1">
        <div class="card-image">
          <img src="">
        </div>
        <div class="card-action">
          <a href="#">Ajouter</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card small">
        <div class="card-image">
          <img src="http://www.lelion.org/images/partenaires/grandes/ela.png">
        </div>
        <div class="card-action">
          <a href="#">Modifier</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card small">
        <div class="card-image">
          <img src="http://www.topkids-minibasket.fr/Images/logo-ENFANTSDELATERRE.jpg">
        </div>
        <div class="card-action">
          <a href="#">Modifier</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card small">
        <div class="card-image">
          <img src="http://2.bp.blogspot.com/-sLGDaK1UOBQ/TqBHqxgVa-I/AAAAAAAAAQg/XZE1lKlXG4E/s1600/Restaurants_Du_Coeur.JPG">
        </div>
        <div class="card-action">
          <a href="#">Modifier</a>
        </div>
      </div>
    </div>
  </div>
  
  <div class="row">
    <div class="col s12">
      <div class="card grey lighten-5 z-depth-1">
        <div class="card-content blue-grey-text text-darken-2">
          <h4 class="blue-grey-text text-darken-2">Les compagnies</h4>
          <span class="blue-grey-text text-darken-2">Circa hos dies Lollianus primae lanuginis adulescens, Lampadi filius ex praefecto, exploratius causam Maximino spectante, convictus codicem noxiarum artium nondum per aetatem firmato consilio descripsisse, exulque mittendus, ut sperabatur, patris inpulsu provocavit ad principem, et iussus ad eius comitatum duci, de fumo, ut aiunt, in flammam traditus Phalangio Baeticae consulari cecidit funesti carnificis manu.</span>
        </div>
      </div>
    </div>
  </div>
  
  <div class="row">
    <div class="col">
      <div class="card small z-depth-1">
        <div class="card-image">
          <img src="">
        </div>
        <div class="card-action">
          <a href="#">Ajouter</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card small">
        <div class="card-image">
          <img src="https://pbs.twimg.com/profile_images/606753795343826944/dqTam-Pc.png">
        </div>
        <div class="card-action">
          <a href="#">Modifier</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card small">
        <div class="card-image">
          <img src="http://diablogue.fr/wp-content/uploads/logo-boulanger.jpg">
        </div>
        <div class="card-action">
          <a href="#">Modifier</a>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    
    var self = this;
    self.name = 'homepage';
    
    self.authentified = false;
    self.loaded = false;
    
    self.data = {
      entities: []
    };
    riot.observable(self.data);
    
    self.on('mount', function() {
      console.log(self.name, 'mount');
      facade.tags[self.name] = self;
      if ( _.keys(facade.tags).length===Facade.Tags ) facade.start();
    });
    
    self.on('update', function() {
      console.log(self.name, 'update');
    });
    
    self.on('ready', function() {
      console.log(self.name, 'ready');
      //self.Authentification = Cookies.get('Authentification');
      //self.authentified = self.Authentification!==undefined;
      //self.update();
      //if ( self.authentified ) {
        //self.indicator = phonon.indicator('Veuillez patienter...', false);
        //var payload = { Authentification: self.Authentification };
        //socket.emit('GET /v1/entities', payload); 
      //}
    });
    
    /*socket.on('response GET /v1/entities', function(data) {
      console.log(data);
      self.entities = data;
      self.loaded = true;
      self.update();
      //if ( self.indicator ) self.indicator.close();
    });*/
    
    /**/
    
    loginHandler(e) {
      riot.route('login');
    }
    
    /*selectEntitiesHanlder(e) {
      console.log(e);
    }*/
    
  </script>
  
  <style scoped>
  
    div.card.small {
      width: 150px;
      height: 150px;
    }
    
  </style>
  
</homepage>