<EntityCampaignsDataGrid>
  
  <div class="collection">
    <div class="collection-item" each={ data in opts.dataProvider }>
      <EntityCampaignsItemRenderer item-data={ data } />
    </div>
  </div>
  
  <script>
    
    var self = this;
    
    self.renderer = {};
    self.keys = [];
    
    self.on("mount", function() {
    });
    
    self.on("update", function() {
    });
    
  </script>
  
  <style scoped>
    
  </style>
  
</EntityCampaignsDataGrid>