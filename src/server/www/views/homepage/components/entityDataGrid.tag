<EntityDataGrid>
  
  <ul class="collection">
    <li class="collection-item avatar" each={ data in opts.dataProvider }>
      <EntityItemRenderer item-data={ data } />
    </li>
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
  
</EntityDataGrid>