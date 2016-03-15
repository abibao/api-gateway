<campaign if={ facade.getCurrentState()===Facade.STATE_CAMPAIGN }>

 <div class="container">
    <div class="row"> </div>
    <div class="row">
      <div class="card grey lighten-5 z-depth-1 col s12 m5">
        <div class="card-content blue-grey-text text-darken-2">
          <h4>Campaign</h4>
          <div class="row">
            <form class="col s12">
              <div class="row"> </div>
              <div class="row">
                <div class="input-field col s12">
                  <input disabled value="{ facade.getCurrentCampaign().company.name }" autocomplete="off" class="fit-parent form" type="text">
                  <label class="active brown-text text-darken-2">Compagnie</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <input onchange={ changeNameHandler } value="{ facade.getCurrentCampaign().name }" autocomplete="off" class="fit-parent form" type="text" placeholder="Choisissez le nom de l'entité">
                  <label class="active brown-text text-darken-2">Nom de la campagne</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s4">
                  <input onchange={ changePriceHandler } value="{ facade.getCurrentCampaign().price }" autocomplete="off" class="fit-parent form" type="text" placeholder="Choisissez le nom de l'entité">
                  <label class="active brown-text text-darken-2">Rémunération</label>
                </div>
                <div class="input-field col s4">
                  <select onchange={ changeCurrencyHandler }>
                    <option value="" disabled { (facade.getCurrentCampaign().currency==='') ? 'selected' : '' }>Choisissez</option>
                    <option value="EUR" { (facade.getCurrentCampaign().currency==='EUR') ? 'selected' : '' }>Euros</option>
                  </select>
                  <label class="brown-text text-darken-2">Devise</label>
                </div>
                <div class="input-field col s4">
                  <input id="published" onchange={ changePublishedHandler } type="checkbox" class="filled-in blue-grey-text text-darken-2" { ( facade.getCurrentCampaign().published ) ? 'checked="checked"' : '' }>
                  <label for="published">Publiée</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <textarea onchange={ changeDescriptionHandler } row="5" class="materialize-textarea" length="255">{ facade.getCurrentCampaign().description }</textarea>
                  <label class="active brown-text text-darken-2">Description de la campagne</label>
                </div>
              </div>
            </form>
          </div>
          <p>
            <a class="waves-effect waves-light btn blue-grey darken-2" onclick={ updateCampaignHandler }>Sauver</a>
            <a class="waves-effect waves-light btn brown darken-2 right" onclick={ closeCampaignHandler }>Retour</a>
          </p>
        </div>
      </div>
      
      <div class="card grey lighten-5 z-depth-1 col s12 m6 right">
        <div class="card-content blue-grey-text text-darken-2">
          <h4>Liste des items [{ facade.getCurrentCampaign().items.length }]</h4>
          <div>
            <a href="#" onclick={ createItemMultipleChoiceHandler } tooltip="ABIBAO_COMPONENT_MULTIPLE_CHOICE"><i class="material-icons blue-grey-text text-darken-2 left">filter_1</i></a>
            <a href="#" tooltip="ABIBAO_COMPONENT_DROPDOWN"><i class="material-icons blue-grey-text text-darken-2 left">filter_2</i></a>
            <a href="#"><i class="material-icons blue-grey-text text-darken-2 left">filter_3</i></a>
            <a href="#"><i class="material-icons blue-grey-text text-darken-2 left">filter_4</i></a>
          </div>
          <div class="row"> </div>
          <CampaignItemDataGrid data-provider={ facade.getCurrentCampaign().items } />
        </div>
      </div>
      
    </div>
  </div>
  
  <script>
    
    self = this;
    self.name = "campaign";
    
    self.on("mount", function() {
      facade.tags[self.name] = self;
      if ( _.keys(facade.tags).length===Facade.Tags ) facade.start();
    });
    
    self.on("EVENT_CREATION_COMPLETE", function() {
      console.log("EVENT_CREATION_COMPLETE");
      $('select').material_select();
      $('textarea').trigger('autoresize');
      facade.trigger("EVENT_RIOT_UPDATE");
    });
    
    createItemMultipleChoiceHandler(e) {
      facade.trigger("CREATE_ABIBAO_COMPONENT_MULTIPLE_CHOICE", facade.getCurrentCampaign().urn);
    };
    
    changeNameHandler(e) {
      facade.getCurrentCampaign().name =  e.currentTarget.value;
    };
    
    changePriceHandler(e) {
      facade.getCurrentCampaign().price =  e.currentTarget.value;
    };
    
    changeCurrencyHandler(e) {
      facade.getCurrentCampaign().currency =  e.currentTarget.selectedOptions[0].value;
    };
    
    changeDescriptionHandler(e) {
       facade.getCurrentCampaign().description = e.currentTarget.value;
    };
    
    changePublishedHandler(e) {
      facade.getCurrentCampaign().published = e.currentTarget.checked;
    };
    
    updateCampaignHandler(e) {
    console.log(facade.getCurrentCampaign());
      facade.actions.campaigns.update(facade.getCurrentCampaign());
    };
    
    closeCampaignHandler(e) {
      facade.setCurrentState(Facade.STATE_ENTITY);
      facade.trigger("EVENT_SELECT_ENTITY", facade.getCurrentCampaign().company.urn);
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
  
</campaign>
