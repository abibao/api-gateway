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
                <span class="uk-text-bold">Question *</span><br>
                <input onchange={ changeQuestionHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItem().question }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Description *</span><br>
                <textarea onchange={ changeDescriptionHandler } rows="6" class="uk-width-1-1" placeholder="Saisissez une valeur">{ facade.getCurrentCampaignItem().description }</textarea>
                <span class="uk-text-bold">Tags *</span><br>
                <input onchange={ changeTagsHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItem().tags }" placeholder="Saisissez une valeur">
              </div>
            </fieldset>
            <br>
            <button type="button" onclick={ updateCampaignHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large blue-grey darken-2 white-text">Sauver</button>
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
    
  </script>
  
  <style scoped>
    .uk-container {
      width: 960px;
    }
  </script>
  
</campaign-item>