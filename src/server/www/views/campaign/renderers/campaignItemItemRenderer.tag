<CampaignItemItemRenderer>
  
  <li class="collection-item">
    <i class="material-icons circle">add</i><span class="title">{ opts.itemData.question }</span>
  </li>
  
  <script>
    
    var self = this;
    
    self.on("mount", function() {
    });
    
    self.on("update", function() {
    });
    
    onSelect(e) {
      facade.trigger("EVENT_SELECT_CAMPAIGN", opts.itemData.urn);
    }
    
  </script>
  
  <style scoped>

  </style>
  
</CampaignItemItemRenderer>