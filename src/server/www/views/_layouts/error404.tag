<error404 if={ facade.getCurrentState()===Facade.STATE_404_ERROR }>

  <h1>ERREUR 404</h1>
  
  <script>
    
    var self = this;
    self.name = "error404";

    self.on("mount", function() {
      facade.tags[self.name] = self;
      if ( _.keys(facade.tags).length===Facade.Tags ) facade.start();
    });
    
    self.on("update", function() {
    });
    
  </script>
  
  <style scoped>
    
  </style>
  
</error404>