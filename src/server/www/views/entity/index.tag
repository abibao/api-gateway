<entity if={ facade.getCurrentState()===Facade.STATE_ENTITY }>

  <div class="container">
    <div class="row"> </div>
    
    <div class="row">
      
      <div class="card grey lighten-5 z-depth-1 col s12 m4">
        <div class="card-content blue-grey-text text-darken-2">
          <h4>Fiche d'identité</h4>
          <input onchange={ changeNameHandler } value="{ facade.getCurrentEntity().name }" autocomplete="off" class="fit-parent form" type="text" placeholder="Choisissez le nom de l'entité">
          <input onchange={ changeContactHandler } value="{ facade.getCurrentEntity().contact }" autocomplete="off" class="fit-parent form" type="email" placeholder="Choisissez l'email du contact">
          <div class="input-field">
            <select onchange={ changeTypeHandler }>
              <option value="" disabled { (facade.getCurrentEntity().type==='') ? 'selected' : '' }>Choisissez le type de l'entité</option>
              <option value="abibao" { (facade.getCurrentEntity().type==='abibao') ? 'selected' : '' }>Abibao</option>
              <option value="charity" { (facade.getCurrentEntity().type==='charity') ? 'selected' : '' }>Association</option>
              <option value="company" { (facade.getCurrentEntity().type==='company') ? 'selected' : '' }>Entreprise</option>
            </select>
          </div>
          <div class="input-field">
            <textarea onchange={ changeDescriptionHandler } rows="5" class="materialize-textarea">{ facade.getCurrentEntity().description }</textarea>
          </div>
          <div class="row"> </div>
          <p><a class="waves-effect waves-light btn blue-grey darken-2" onclick={ submitHandler }>Sauver</a></p>
        </div>
      </div>

      <div class="card grey lighten-5 z-depth-1 col s12 m7 right">
        <div class="card-content blue-grey-text text-darken-2">
          <h4>Liste des campagnes [{ facade.getCurrentEntity().campaigns.length }]</h4>
          <EntityCampaignsDataGrid data-provider={ facade.getCurrentEntity().campaigns }> </EntityCampaignsDataGrid>
          <div class="row"> </div>
          <p><a class="waves-effect waves-light btn blue-grey darken-2" onclick={ createCampaignHandler }>Ajouter</a></p>
        </div>
      </div>
      
    </div>
  </div>
  
  <script>
    
    self = this;
    self.name = "entity";
    
    self.loaded = false;
    
    self.on("mount", function() {
      facade.tags[self.name] = self;
      if ( _.keys(facade.tags).length===Facade.Tags ) facade.start();
    });
    
    self.on("ENTITY_LOAD_COMPLETE", function() {
    console.log("ENTITY_LOAD_COMPLETE");
      $('select').material_select();
    });
    
    changeNameHandler(e) {
      facade.getCurrentEntity().name = e.currentTarget.value;
    };
    
    changeContactHandler(e) {
      facade.getCurrentEntity().contact = e.currentTarget.value;
    };
    
    changeTypeHandler(e) {
      facade.getCurrentEntity().type = e.currentTarget.selectedOptions[0].value;
    };
    
    changeDescriptionHandler(e) {
    console.log(e.currentTarget.value);
      facade.getCurrentEntity().description = e.currentTarget.value;
    }
    
    submitHandler(e) {
      facade.actions.entities.update(facade.getCurrentEntity()).then(function() {
        return facade.actions.entities.list().then(function() {
          Materialize.toast("Sauvegarde \"entity\" effectuée", 4000, "light-green darken-2");
        });
      }).catch(function(error) {
        Materialize.toast(error.message, 4000, "deep-orange darken-3");
      });
    };
    
    createCampaignHandler(e) {
    };
    
  </script>
  
  <style scoped>
    textarea.materialize-textarea:focus:not([readonly]),
    input[type=text]:focus:not([readonly]),
    input[type=email]:focus:not([readonly]) {
      border-bottom: 1px solid #455a64;
      box-shadow: 0 1px 0 0 #607d8b;
    }
    .input-field {
      margin-top: 0;
    }
  </style>
  
</entity>
