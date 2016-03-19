<entity if={ facade.getCurrentState()===Facade.STATE_ENTITY }>

  <div if={ facade.getLoading()===false } class="uk-container uk-container-center uk-height-1-1">
    <div class="uk-width-1-1">
      <p>
        <h2><a href="#homepage">HOMEPAGE</a> > ENTITY</h2>
      </p>
      <div class="uk-flex">
        <div class="uk-width-1-2 uk-panel uk-panel-box uk-margin-left">
          <ul class="uk-dotnav">
            <li class={ (dotnav==="dotnav1") ? 'uk-active' : '' }><a href="javascript:void(0)" onclick={ selectDotnavDefault }>Défault</a></li>
            <li class={ (dotnav==="dotnav2") ? 'uk-active' : '' }><a href="javascript:void(0)" onclick={ selectDotnavDetails }>Défault</a></li>
            <li class={ (dotnav==="dotnav3") ? 'uk-active' : '' }><a href="javascript:void(0)" onclick={ selectDotnavImages }>Défault</a></li>
          </ul>
          <form if={ dotnav==="dotnav1" } class="uk-form uk-width-1-1">
            <fieldset>
              <div class="uk-form-row uk-width-1-1">
                <span class="uk-text-bold">Nom *</span><br>
                <input onchange={ changeNameHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().name }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Type *</span><br>
                <input onchange={ changeTypeHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().type }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Contact *</span><br>
                <input onchange={ changeContactHandler } class="uk-width-1-1" type="email" value="{ facade.getCurrentEntity().contact }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Site web *</span><br>
                <input onchange={ changeURLHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().url }" placeholder="Saisissez une valeur">
              </div>
            </fieldset>
            <br>
            <button type="button" onclick={ updateEntityHandler } class="uk-width-1-4 uk-button uk-button-primary uk-button-large">Sauver</button>
          </form>
          <form if={ dotnav==="dotnav2" } class="uk-form uk-width-1-1">
            <fieldset>
              <div class="uk-form-row uk-width-1-1">
                <span class="uk-text-bold">Titre *</span><br>
                <input onchange={ changeTitleHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().title }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Accroche *</span><br>
                <input onchange={ changeHangsHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().hangs }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Description *</span><br>
                <textarea onchange={ changeDescriptionHandler } rows="6" class="uk-width-1-1" placeholder="Saisissez une valeur">{ facade.getCurrentEntity().description }</textarea>
              </div>
            </fieldset>
            <br>
            <button type="button" onclick={ updateEntityHandler } class="uk-width-1-4 uk-button uk-button-primary uk-button-large">Sauver</button>
          </form>
          <form if={ dotnav==="dotnav3" } class="uk-form uk-width-1-1">
            <div class="uk-form-row uk-width-1-1">
              <fieldset>
                <div id="upload-drop-icon" class="uk-placeholder">
                  <i class="uk-icon-cloud-upload uk-icon-medium uk-text-muted uk-margin-small-right"></i> <span class="uk-text-bold">Icone (50x50)</span> "Glisser/Déposer" ou <a class="uk-form-file">"Parcourir"<input id="upload-select-icon" type="file"></a>
                </div>
                <div id="progressbar-icon" class="uk-progress uk-hidden">
                  <div class="uk-progress-bar" style="width: 0%;">...</div>
                </div>
                <div id="upload-drop-avatar" class="uk-placeholder">
                  <i class="uk-icon-cloud-upload uk-icon-medium uk-text-muted uk-margin-small-right"></i> <span class="uk-text-bold">Avatar (200x200)</span> "Glisser/Déposer" ou <a class="uk-form-file">"Parcourir"<input id="upload-select-avatar" type="file"></a>
                </div>
                <div id="progressbar-avatar" class="uk-progress uk-hidden">
                  <div class="uk-progress-bar" style="width: 0%;">...</div>
                </div>
                <div id="upload-drop-picture" class="uk-placeholder">
                  <i class="uk-icon-cloud-upload uk-icon-medium uk-text-muted uk-margin-small-right"></i> <span class="uk-text-bold">Image (400x200)</span> "Glisser/Déposer" ou <a class="uk-form-file">"Parcourir"<input id="upload-select-picture" type="file"></a>
                </div>
                <div id="progressbar-picture" class="uk-progress uk-hidden">
                  <div class="uk-progress-bar" style="width: 0%;">...</div>
                </div>
              </fieldset>
            </div>
            <br>
            <button type="button" onclick={ updateEntityHandler } class="uk-width-1-4 uk-button uk-button-primary uk-button-large">Sauver</button>
          </form>
        </div>
      </div>
      <div class="uk-width-1-2 uk-panel uk-panel-box uk-margin-left">
      
      </div>
    </div>
  </div>
  
  <script>
    
    var self = this;
    self.name = "entity";
    
    self.dotnav = "dotnav1";
    
    selectDotnavDefault(e) {
      self.dotnav = "dotnav1";
      self.update();
    };
    
    selectDotnavDetails(e) {
      self.dotnav = "dotnav2";
      self.update();
    };
    
    selectDotnavImages(e) {
      self.dotnav = "dotnav3";
      self.updateDropZoneIcon();
      self.update();
    }
    
    self.on("mount", function() {
      facade.tags[self.name] = self;
    });
    
    changeViewDefaultHandler(e) {
      self._currentState = "STATE_DEFAULT";
      self.update();
    };
    
    changeViewDetailsHandler(e) {
      self._currentState = "STATE_DETAILS";
      self.update();
    };
    
    changeViewImagesHandler(e) {
      self._currentState = "STATE_IMAGES";
      self.update();
    };
    
    changeNameHandler(e) {
      facade.getCurrentEntity().name = e.currentTarget.value;
    };
    
    changeContactHandler(e) {
      facade.getCurrentEntity().contact = e.currentTarget.value;
    };
    
    changeURLHandler(e) {
      facade.getCurrentEntity().url = e.currentTarget.value;
    };
    
    changeTypeHandler(e) {
      facade.getCurrentEntity().type = e.currentTarget.selectedOptions[0].value;
    };
    
    changeTitleHandler(e) {
      facade.getCurrentEntity().title = e.currentTarget.value;
    };
    
    changeHangsHandler(e) {
      facade.getCurrentEntity().hangs = e.currentTarget.value;
    };
    
    changeDescriptionHandler(e) {
      facade.getCurrentEntity().description = e.currentTarget.value;
    };
    
    updateEntityHandler(e) {
      facade.actions.entities.update(facade.getCurrentEntity());
    };
    
    createCampaignHandler(e) {
    };
    
    closeEntityHandler(e) {
      riot.route("/homepage");
    };
    
    self.updateDropZoneIcon = function() {
      var progressbarIcon = $("#progressbar-icon");
      var uploadSelectIcon = $("#upload-select-icon");
      var uploadDropIcon = $("#upload-drop-icon");
      var bar = progressbarIcon.find('.uk-progress-bar');
      var settings = {
        action: '/', // upload url
        allow : '*.(jpg|jpeg|gif|png)', // allow only images
        loadstart: function() {
          bar.css("width", "0%").text("0%");
          progressbarIcon.removeClass("uk-hidden");
        },
        progress: function(percent) {
          percent = Math.ceil(percent);
          bar.css("width", percent+"%").text(percent+"%");
        },
        allcomplete: function(response) {
          bar.css("width", "100%").text("100%");
          setTimeout(function() {
            progressbarIcon.addClass("uk-hidden");
          }, 250);
          // alert("Upload Completed")
        }
      };
      var select = UIkit.uploadSelect(uploadSelectIcon, settings);
      var drop = UIkit.uploadDrop(uploadDropIcon, settings);
    };
    
  </script>
  
  <style scoped>
  
    .uk-container {
      border-left: solid #e0e0e0 0.25rem;
      border-right: solid #e0e0e0 0.25rem;
      width: 960px;
    }
    
  </style>
  
</entity>