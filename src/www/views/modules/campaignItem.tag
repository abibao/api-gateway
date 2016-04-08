<campaign-item>
  
  <navbar> </navbar>
  
  <div if={ facade.getLoading()===false } class="uk-container uk-container-center uk-height-1-1">
  
    <div class="uk-grid uk-grid-medium">
    
      <div class="uk-width-1-2">
        <div class="uk-panel uk-panel-box">
          <form class="uk-form uk-width-1-1">
            <fieldset>
              <div class="uk-form-row uk-width-1-1">
                <span class="uk-text-bold">Type</span><br>
                <input class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItem().type }" disabled>
                <span class="uk-text-bold">Question</span><br>
                <input onchange={ changeQuestionHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItem().question }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Description</span><br>
                <textarea onchange={ changeDescriptionHandler } rows="6" class="uk-width-1-1" placeholder="Saisissez une valeur">{ facade.getCurrentCampaignItem().description }</textarea>
                <span class="uk-text-bold">Tags</span><br>
                <input onchange={ changeTagsHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItem().tags }" placeholder="Saisissez une valeur">
              </div>
            </fieldset>
            <br>
            <button type="button" onclick={ updateCampaignItemHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large blue-grey darken-2 white-text">Sauver</button>
          </form>
        </div>
      </div>

      <div if={ facade.getCurrentCampaignItem().type==='ABIBAO_COMPONENT_MULTIPLE_CHOICE' } class="uk-width-1-2">
        <div class="uk-panel uk-panel-box">
          <form class="uk-form uk-width-1-1">
            <fieldset>
              <div class="uk-form-row uk-width-1-1">
                <span class="uk-text-bold">Options</span><br>
                <input onchange={ changeRequiredHandler } type="checkbox" checked="{ facade.getCurrentCampaignItem().required===true }"> <label>Obligatoire</label><br>
                <input onchange={ changeMultipleSelectionsHandler } type="checkbox" checked="{ facade.getCurrentCampaignItem().multipleSelections===true }"> <label>Sélection multiples</label><br>
                <input onchange={ changeRandomizeHandler } type="checkbox" checked="{ facade.getCurrentCampaignItem().randomize===true }"> <label>Affichage au hasard</label><br>
              </div>
              <div class="uk-form-row uk-width-1-1">
                <span class="uk-text-bold">Choix possibles</span>
                <ul onchange={ changeCampaignItemsChoicesOrderHandler } class="uk-nestable" data-uk-nestable="{handleClass:'uk-nestable-handle'}">
                  <li class="uk-nestable-item" each={ campaignItemChoice in facade.getCurrentCampaignItem().choices } data-uk-tooltip="pos:'left'">
                    <div class="uk-nestable-panel uk-text-truncate">
                      <i class="uk-nestable-handle uk-icon uk-icon-bars uk-margin-small-right"></i>
                      <a href="/#campaigns-items-choices/{ campaignItemChoice.urn }">{ campaignItemChoice.text }</a>
                    </div>
                  </li>
                </ul>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
      
    </div>
    
  </div>
  
  <script>
    
    var self = this;
    
    self.on("mount", function() {
      facade.actions.campaigns.selectCampaignItem(riot.router.current.params.urn)
      .catch(function(error) {
        riot.route("/homepage");
      });
      $(document).arrive(".uk-nestable", self.nestableArrivedHandler);
    });
    
    self.nestableArrivedHandler = function() {
      facade.debugHTML("entity.tag: %s", "nestableArrivedHandler");
      UIkit.nestable($(".uk-nestable"));
    };
    
    changeDescriptionHandler(e) {
      facade.getCurrentCampaignItem().description = e.currentTarget.value;
    };
    
    changeQuestionHandler(e) {
      facade.getCurrentCampaignItem().question = e.currentTarget.value;
    };
    
    changeTagsHandler(e) {
      facade.getCurrentCampaignItem().tags = e.currentTarget.value;
    };
    
    updateCampaignItemHandler(e) {
      facade.actions.campaigns.updateItem(facade.getCurrentCampaignItem());
    };
    
    changeMultipleSelectionsHandler(e) {
      facade.getCurrentCampaignItem().multipleSelections = e.currentTarget.checked;
    };
    
    changeRandomizeHandler(e) {
      facade.getCurrentCampaignItem().randomize = e.currentTarget.checked;
    };
    
    changeRequiredHandler(e) {
      facade.getCurrentCampaignItem().required = e.currentTarget.checked;
    };
    
  </script>
  
  <style scoped>
    .uk-container {
      width: 960px;
    }
  </script>
  
</campaign-item>