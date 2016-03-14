<homepage if={ facade.getCurrentState()===Facade.STATE_HOMEPAGE }>

  <div class="container">
    <div class="row"> </div>
    <div class="row" if={ !facade.stores.auth.authentified() }>
      
    </div>
    <div class="row" if={ facade.stores.auth.authentified() }>
      <h5>Liste des associations</h5>
      <EntityDataGrid if={ facade.stores.auth.authentified() } data-provider={ facade.stores.entities.charities }> </EntityDataGrid>
      <h5>Liste des compagnies</h5>
      <EntityDataGrid if={ facade.stores.auth.authentified() } data-provider={ facade.stores.entities.companies }> </EntityDataGrid>
    </div>
  </div>
  
  <script>
    
    var self = this;
    self.name = "homepage";
    
    self.on("mount", function() {
      facade.tags[self.name] = self;
      if ( _.keys(facade.tags).length===Facade.Tags ) facade.start();
    });
    
    self.on("update", function() {
    });
    
  </script>
  
  <style scoped>
    
  </style>
  
</homepage>