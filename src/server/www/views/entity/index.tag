<entity if={ facade.getCurrentState()===Facade.STATE_ENTITY }>

  <div class="container">
    <div class="row"> </div>
    <div class="row">
      <div class="card grey lighten-5 z-depth-1 col s12 m5">
        <!-- STATE_DEFAULT -->
        <div if={ getCurrentState()==='STATE_DEFAULT' } class="card-content blue-grey-text text-darken-2">
          <a href="javascript:void(0)" onclick={ changeViewDetailsHandler } class="large right"><i class="material-icons blue-grey-text text-darken-2">assessment</i></a>
          <a href="javascript:void(0)" onclick={ changeViewPicturesHandler } class="large right"><i class="material-icons blue-grey-text text-darken-2">image</i></a>
          <h4>Entity (Défaut)</h4>
          <div class="row">
            <form class="col s12">
              <div class="row"> </div>
              <div class="row">
                <div class="input-field col s12">
                  <input onchange={ changeNameHandler } value="{ facade.getCurrentEntity().name }" autocomplete="off" class="fit-parent form" type="text" placeholder="Saisissez une valeur">
                  <label class="active brown-text text-darken-2">Nom</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <input onchange={ changeCantactHandler } value="{ facade.getCurrentEntity().contact }" autocomplete="off" class="fit-parent form" type="email" placeholder="Saisissez une valeur">
                  <label class="active brown-text text-darken-2">Email de contact</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <input onchange={ changeURLHandler } value="{ facade.getCurrentEntity().url }" autocomplete="off" class="fit-parent form" type="email" placeholder="Saisissez une valeur">
                  <label class="active brown-text text-darken-2">URL du site</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <select onchange={ changeTypeHandler }>
                    <option value="" disabled { (facade.getCurrentEntity().type==='') ? 'selected' : '' }>Choisissez une valeur</option>
                    <option value="abibao" { (facade.getCurrentEntity().type==='abibao') ? 'selected' : '' }>Abibao</option>
                    <option value="charity" { (facade.getCurrentEntity().type==='charity') ? 'selected' : '' }>Association</option>
                    <option value="company" { (facade.getCurrentEntity().type==='company') ? 'selected' : '' }>Entreprise</option>
                  </select>
                  <label class="brown-text text-darken-2">Type</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <textarea row="5" class="materialize-textarea" length="255">{ facade.getCurrentEntity().description }</textarea>
                  <label class="active brown-text text-darken-2">Description</label>
                </div>
              </div>
            </form>
          </div>
          <p>
            <a class="waves-effect waves-light btn blue-grey darken-2" onclick={ updateEntityHandler }>Sauver</a>
            <a class="waves-effect waves-light btn brown darken-2 right" onclick={ closeEntityHandler }>Retour</a>
          </p>
        </div>
      </div>
      <div class="card grey lighten-5 z-depth-1 col s12 m6 right">
        <div class="card-content blue-grey-text text-darken-2">
          <h4>Liste des campagnes [{ facade.getCurrentEntity().campaigns.length }]</h4>
          <EntityCampaignsDataGrid data-provider={ facade.getCurrentEntity().campaigns }> </EntityCampaignsDataGrid>
          <div class="row"> </div>
          <p><a class="waves-effect waves-light btn blue-grey darken-2 disabled" onclick={ createCampaignHandler }>Ajouter</a></p>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    
    var self = this;
    self.name = "entity";
    
    self._currentState = "STATE_DEFAULT";
    self.getCurrentState = function() {
      return self._currentState;
    };
    
    self.on("mount", function() {
      facade.tags[self.name] = self;
    });
    
    self.on("EVENT_CREATION_COMPLETE", function() {
      console.log("EVENT_CREATION_COMPLETE");
      $('select').material_select();
      $('textarea').trigger('autoresize');
      facade.trigger("EVENT_RIOT_UPDATE");
    });
    
    changeViewDetailsHandler(e) {
      self._currentState = "STATE_DETAILS";
      self.update();
    }
    
    changeNameHandler(e) {
      facade.getCurrentEntity().name = e.currentTarget.value;
    };
    
    changeContactHandler(e) {
      facade.getCurrentEntity().contact = e.currentTarget.value;
    };
    
    changeURLHandler(e) {
      facade.getCurrentEntity().url = e.currentTarget.value;
    };
    
    changeTypeHandler(e) {
      facade.getCurrentEntity().type = e.currentTarget.selectedOptions[0].value;
    };
    
    changeDescriptionHandler(e) {
      facade.getCurrentEntity().description = e.currentTarget.value;
    }
    
    updateEntityHandler(e) {
      facade.actions.entities.update(facade.getCurrentEntity());
    };
    
    createCampaignHandler(e) {
    };
    
    closeEntityHandler(e) {
      riot.route("/homepage");
    };
    
  </script>
  
  <style scoped>
  
    textarea.materialize-textarea:focus:not([readonly]),
    input[type=text]:focus:not([readonly]),
    input[type=email]:focus:not([readonly]) {
      border-bottom: 1px solid #455a64;
      box-shadow: 0 1px 0 0 #607d8b;
    }
    form .row {
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
  </style>
  
</entity>