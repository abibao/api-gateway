<HomepageEntitiesItemRenderer>

  <img if={ opts.itemData.avatar!=='images/avatars/default.png' } src="{ opts.itemData.avatar }" alt="" class="circle">
  <i if={ opts.itemData.avatar==='images/avatars/default.png' } class="material-icons blue-grey darken-2 circle">open_in_browser</i>
  <span class="title bold blue-grey-text text-darken-2">{ opts.itemData.name }</span>
  <p>
    Contact : { opts.itemData.contact }<br>
    Dernière modification : { opts.itemData.modifiedAt }
  </p>
  <a href="#" if={ opts.itemData.type!=='charity' } onclick={ onSelect } class="secondary-content"><i class="material-icons blue-grey-text text-darken-2">mode edit</i></a>
  
  <script>
    
    var self = this;
    
    self.on("mount", function() {
    });
    
    self.on("update", function() {
    });
    
    onSelect(e) {
      if( opts.itemData.type==='charity' ) {
        console.log("Charity not yes implemented");
        return;
      }
      facade.trigger("EVENT_SELECT_ENTITY", opts.itemData.urn);
    }
    
  </script>
  
  <style scoped>

  </style>
  
</HomepageEntitiesItemRenderer>