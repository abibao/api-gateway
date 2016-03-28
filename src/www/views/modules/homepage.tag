<homepage>
  
  <navbar> </navbar>
  
  <div if={ facade.getLoading()===false } class="uk-container uk-container-center uk-height-1-1">

    <h4>Les associations</h4>
    <div class="uk-grid uk-grid-medium">
      <div class="uk-width-1-2" each={ charity in facade.stores.entities.charities }>
        <div class="uk-panel uk-panel-box">
          <h3 class="uk-panel-title"><a href="javascript:void(0)">{ charity.name }</a></h3>
          <img class="uk-thumbnail uk-float-left" style="margin: 0.25rem" src={ charity.avatar+'.svg' } alt="" width="80" height="80">
          <div class="uk-float-left" style="margin: 0.25rem">
            <span class="uk-text-bold">titre:</span> <span class="uk-text-truncate">{ charity.title }</span><br>
            <span class="uk-text-bold">accroche:</span> <span class="uk-text-truncate">{ charity.hangs }</span><br>
            <span class="uk-text-bold">contact:</span> <a href="mailto:{ charity.contact }">{ charity.contact }</a><br>
            <span class="uk-text-bold">url:</span> <a href="{ charity.url }">{ charity.url }</a>
          </div>
        </div>
      </div>
    </div>
    
    <h4>Les compagnies</h4>
    <div class="uk-grid uk-grid-medium">
      <div class="uk-width-1-2" each={ company in facade.stores.entities.companies }>
        <div class="uk-panel uk-panel-box">
          <h3 class="uk-panel-title"><a href="/#entities/{ company.urn }">{ company.name }</a></h3>
          <img class="uk-thumbnail uk-float-left" style="margin: 0.25rem" src={ company.avatar+'.svg' } alt="" width="80" height="80">
          <div class="uk-float-left" style="margin: 0.25rem">
            <span class="uk-text-bold">titre:</span> <span class="uk-text-truncate">{ company.title }</span><br>
            <span class="uk-text-bold">accroche:</span> <span class="uk-text-truncate">{ company.hangs }</span><br>
            <span class="uk-text-bold">contact:</span> <a href="mailto:{ company.contact }">{ company.contact }</a><br>
            <span class="uk-text-bold">url:</span> <a href="{ company.url }">{ company.url }</a>
          </div>
        </div>
      </div>
    </div>
    
  </div>
  
  <script>
    
    var self = this;
    self.name = "homepage";
    
    self.disabled = ''; 
    
    self.on("mount", function() {
      facade.initialize();
    });
    
    self.on("update", function() {
      (facade.getLoading()===false) ? self.disabled = '' : self.disabled = 'disabled';
    });
    
  </script>
  
  <style scoped>
    .uk-container {
      width: 960px;
    }
  </style>
  
</homepage>