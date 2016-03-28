<campaign>
  
  <navbar> </navbar>
  
  <div if={ facade.getLoading()===false } class="uk-container uk-container-center uk-height-1-1">
    
    <div class="uk-grid uk-grid-medium">
      <div class="uk-width-1-2">
      
        <div class="uk-panel uk-panel-box">
          <form class="uk-form uk-width-1-1">
            <fieldset>
              <div class="uk-form-row uk-width-1-1">
                <span class="uk-text-bold">Compagnie</span><br>
                <input class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaign().company.name }" disabled>
                <span class="uk-text-bold">Nom *</span><br>
                <input onchange={ changeNameHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaign().name }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Description *</span><br>
                <textarea onchange={ changeDescriptionHandler } rows="6" class="uk-width-1-1" placeholder="Saisissez une valeur">{ facade.getCurrentCampaign().description }</textarea>
              </div>
            </fieldset>
            <br>
            <button type="button" onclick={ updateCampaignHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large blue-grey darken-2 white-text">Sauver</button>
          </form>
        </div>
        
      </div>
      <div class="uk-width-1-2">
        
        <div class="uk-panel uk-panel-box">
          <h4>Questions de la campagne</h4>
          <ul onchange={ changeCampaignItemsOrderHandler } class="uk-nestable" data-uk-nestable="{handleClass:'uk-nestable-handle'}">
            <li class="uk-nestable-item" each={ campaignItem in facade.getCurrentCampaign().items } data-uk-tooltip="pos:'left'" title={ campaignItem.type }>
              <input type="text" class="urnCampaignItem" value={ campaignItem.urn } style="display:none">
              <div class="uk-nestable-panel uk-text-truncate">
                <i if={ campaignItem.type==="ABIBAO_COMPONENT_DROPDOWN" } class="uk-nestable-handle uk-icon uk-icon-toggle-down uk-margin-small-right"></i>
                <i if={ campaignItem.type==="ABIBAO_COMPONENT_LONG_TEXT" } class="uk-nestable-handle uk-icon uk-icon-file-text-o uk-margin-small-right"></i>
                <i if={ campaignItem.type==="ABIBAO_COMPONENT_SHORT_TEXT" } class="uk-nestable-handle uk-icon uk-icon-text-width uk-margin-small-right"></i>
                <i if={ campaignItem.type==="ABIBAO_COMPONENT_MULTIPLE_CHOICE" } class="uk-nestable-handle uk-icon uk-icon-list-ol uk-margin-small-right"></i>
                <i if={ campaignItem.type==="ABIBAO_COMPONENT_NUMBER" } class="uk-nestable-handle uk-icon uk-icon-sort-numeric-asc uk-margin-small-right"></i>
                <i if={ campaignItem.type==="ABIBAO_COMPONENT_YES_NO" } class="uk-nestable-handle uk-icon uk-icon-toggle-on uk-margin-small-right"></i>
                <div if={ campaignItem.choices.length>0 } class="uk-badge uk-badge-notification uk-badge-success">{ campaignItem.choices.length }</div>
                <div if={ campaignItem.choices.length===0 } class="uk-badge uk-badge-notification uk-badge-danger"> </div>
                <a href="/#campaigns/items/{ campaignItem.urn }">{ campaignItem.question }</a>
              </div>
            </li>
          </ul>
          <button type="button" onclick={ updateCampaignItemsHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large blue-grey darken-2 white-text">Sauver</button>
          <button type="button" onclick={ createCampaignItemsHandler } class="uk-width-1-4 uk-button uk-button-primary uk-button-large uk-float-right brown darken-2 white-text">Ajouter</button>
        </div>
        
      </div>
    </div>
  
  </div>

  <script>
    
    var self = this;
    self.name = "campaign";
    
    self.on("mount", function() {
      facade.actions.campaigns.selectCampaign(riot.router.current.params.urn)
      .catch(function(error) {
        riot.route("/homepage");
      });
      $(document).arrive(".uk-nestable", self.nestableArrivedHandler);
    });
    
    self.nestableArrivedHandler = function() {
      facade.debugHTML("entity.tag: %s", "nestableArrivedHandler");
      UIkit.nestable($(".uk-nestable"));
    };
    
    createItemMultipleChoiceHandler(e) {
      //facade.trigger("CREATE_ABIBAO_COMPONENT_MULTIPLE_CHOICE", facade.getCurrentCampaign().urn);
    };
    
    changeCampaignItemsOrderHandler(e) {
      var i = 1;
      lodash.map($(".uk-nestable li .urnCampaignItem"), function(item) {
        var item = lodash.find(facade.getCurrentCampaign().items, {urn: item.value});
        item.position = i;
        i = i + 1;
      });
      self.update();
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
      facade.actions.campaigns.update(facade.getCurrentCampaign());
    };
    
    updateCampaignItemsHandler(e) {
      lodash.map(facade.getCurrentCampaign().items, function(item) {
        facade.actions.campaigns.updateItem(item);
      });
    };
    
    closeCampaignHandler(e) {
      
    };
    
  </script>
  
  <style scoped>
    .uk-container {
      width: 960px;
    }
    .uk-badge-success {
      width: 28px;
    }
    .uk-badge-danger {
      width: 28px;
    }
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
