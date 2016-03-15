<EntityCampaignsItemRenderer>
  
  <span>
    <div if={ opts.itemData.published===true } class="chip bold white-text light-green darken-2">{ opts.itemData.items.length }</div>
    <div if={ opts.itemData.published===false } class="chip bold white-text deep-orange darken-3">{ opts.itemData.items.length }</div>
    &nbsp;&nbsp;{ opts.itemData.name }
    <a href="#" onclick={ onSelect } class="secondary-content"><i class="material-icons blue-grey-text text-darken-2">mode edit</i></a>
  </span>
  
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
  
</EntityCampaignsItemRenderer>