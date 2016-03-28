<CampaignItemItemRenderer>
  
  <li class="collection-item">
    <i if={ opts.itemData.type==='ABIBAO_COMPONENT_MULTIPLE_CHOICE' } class="material-icons brown-text text-darken-2 left">filter_1</i>
    <i if={ opts.itemData.type==='ABIBAO_COMPONENT_DROPDOWN' } class="material-icons brown-text text-darken-2 left">filter_2</i>
    <span class="title">{ opts.itemData.question }</span>
    <a href="javascript:void(0)" onclick={ onSelect } class="right"><i class="material-icons blue-grey-text text-darken-2">mode_edit</i></a>
  </li>
  
  <script>
    
    var self = this;
    
    self.on("mount", function() {
    });
    
    self.on("update", function() {
    });
    
    onSelect(e) {
      facade.trigger("EVENT_SELECT_CAMPAIGN_ITEM", opts.itemData.urn);
    }
    
  </script>
  
  <style scoped>

  </style>
  
</CampaignItemItemRenderer>