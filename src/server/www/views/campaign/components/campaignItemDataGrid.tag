<CampaignItemDataGrid>
  
  <ul class="collection" each={ data in opts.dataProvider }>
    <CampaignItemItemRenderer item-data={ data }> </CampaignItemItemRenderer>
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
    ul.collection {
      margin-bottom: 0;
    }
  </style>
  
</CampaignItemDataGrid>