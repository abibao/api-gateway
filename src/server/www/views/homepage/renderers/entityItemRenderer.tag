<EntityItemRenderer>

  <img if={ opts.itemData.avatar!=='images/avatars/default.png' } src="{ opts.itemData.avatar }" alt="" class="circle">
  <i if={ opts.itemData.avatar==='images/avatars/default.png' } class="material-icons blue-grey darken-2 circle">open_in_browser</i>
  <span class="title bold blue-grey-text text-darken-2">{ opts.itemData.name }</span>
  <p>
    Contact : { opts.itemData.contact }<br>
    Dernière modification : { opts.itemData.modifiedAt }
  </p>
  <a href="#" onclick={ onSelect } class="secondary-content"><i class="material-icons blue-grey-text text-darken-2">mode edit</i></a>
  
  <script>
    
    var self = this;
    
    self.on("mount", function() {
    });
    
    self.on("update", function() {
    });
    
    onSelect(e) {
      facade.actions.entities.read(opts.itemData.urn).then(function(entity) {
        return facade.actions.entities.campaigns(opts.itemData.urn).then(function(campaigns) {
          entity.campaigns = campaigns;
          facade.setCurrentEntity(entity);
          riot.route("/entity/"+opts.itemData.urn);
          Materialize.toast("Chargement \"entity\" effectuée", 4000, "light-green darken-2");
          facade.tags["entity"].trigger("ENTITY_LOAD_COMPLETE");
        });
      })
      .catch(function(error) {
        self.setCurrentEntity(null);
        Materialize.toast(error.message, 4000, "deep-orange darken-3");
      });
    }
    
  </script>
  
  <style scoped>

  </style>
  
</EntityItemRenderer>