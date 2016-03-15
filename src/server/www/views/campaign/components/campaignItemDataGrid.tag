<CampaignItemDataGrid>
  
  <ul class="collection" each={ data in opts.dataProvider }>
    <CampaignItemItemRenderer item-data={ data } />
  </ul>
  
  <script>
    
    var self = this;
    
    self.renderer = {};
    self.keys = [];
    
    self.on("mount", function() {
    });
    
    self.on("update", function() {
      if (!_.isUndefined(opts.dataProvider)) { self.keys = _.keys(opts.dataProvider[0]); }
    });
    
  </script>
  
  <style scoped>
    
  </style>
  
</CampaignItemDataGrid>