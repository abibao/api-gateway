<campaign-item-choice>
  
  <navbar> </navbar>
  
  <div if={ facade.getLoading()===false } class="uk-container uk-container-center uk-height-1-1">
  
    <div class="uk-grid uk-grid-medium">
    
      <div class="uk-width-1-2">
        <div class="uk-panel uk-panel-box">
          <form class="uk-form uk-width-1-1">
            <fieldset>
              <div class="uk-form-row uk-width-1-1">
                <span class="uk-text-bold">Meta</span><br>
                <input class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItemChoice().meta }" disabled>
                <span class="uk-text-bold">Préfixe</span><br>
                <input class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItemChoice().prefix }">
                <span class="uk-text-bold">Suffixe</span><br>
                <input class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItemChoice().suffix }">
                <span class="uk-text-bold">Texte</span><br>
                <input class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItemChoice().text }">
              </div>
            </fieldset>
            <br>
            <button type="button" onclick={ updateCampaignItemChoiceHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large blue-grey darken-2 white-text">Sauver</button>
          </form>
        </div>
      </div>
    
    </div>
  
  </div>
  
  <script>
    
    var self = this;
    
    self.on("mount", function() {
      facade.actions.campaigns.selectCampaignItemChoice(riot.router.current.params.urn)
      .catch(function(error) {
        riot.route("/homepage");
      });
    });
    
  </script>
  
</campaign-item-choice>