<charity>

  <navbar> </navbar>

  <div if={ facade.getLoading()===false } class="uk-container uk-container-center uk-height-1-1">

    <div class="uk-grid uk-grid-medium">
      <div class="uk-width-1-2">

        <div class="uk-panel uk-panel-box">
          <ul class="uk-dotnav">
            <li class={ (dotnav==="dotnav1") ? 'uk-active' : '' }><a href="javascript:void(0)" onclick={ selectDotnavDefault }>Défault</a></li>
            <li class={ (dotnav==="dotnav2") ? 'uk-active' : '' }><a href="javascript:void(0)" onclick={ selectDotnavDetails }>Défault</a></li>
            <li class={ (dotnav==="dotnav3") ? 'uk-active' : '' }><a href="javascript:void(0)" onclick={ selectDotnavImages }>Défault</a></li>
          </ul>
          <form if={ dotnav==="dotnav1" } class="uk-form uk-width-1-1">
            <fieldset>
              <div class="uk-form-row uk-width-1-1">
                <span class="uk-text-bold">Nom</span><br>
                <input onchange={ changeNameHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().name }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Type</span><br>
                <select onchange={ changeTypeHandler } class="uk-width-1-1">
                  <option value="abibao" selected={ (facade.getCurrentEntity().type==='abibao') ? 'selected' : ''  }>Abibao</option>
                  <option value="company" selected={ (facade.getCurrentEntity().type==='company') ? 'selected' : ''  }>Compagnie</option>
                  <option value="charity" selected={ (facade.getCurrentEntity().type==='charity') ? 'selected' : ''  }>Association</option>
                </select>
                <span class="uk-text-bold">Contact</span><br>
                <input onchange={ changeContactHandler } class="uk-width-1-1" type="email" value="{ facade.getCurrentEntity().contact }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Site web</span><br>
                <input onchange={ changeURLHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().url }" placeholder="Saisissez une valeur">
              </div>
            </fieldset>
            <br>
            <button type="button" onclick={ updateEntityHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large blue-grey darken-2 white-text">Sauver</button>
          </form>
          <form if={ dotnav==="dotnav2" } class="uk-form uk-width-1-1">
            <fieldset>
              <div class="uk-form-row uk-width-1-1">
                <span class="uk-text-bold">Titre</span><br>
                <input onchange={ changeTitleHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().title }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Accroche</span><br>
                <input onchange={ changeHangsHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().hangs }" placeholder="Saisissez une valeur">
                  <span class="uk-text-bold">Usages</span><br>
                  <input onchange={ changeUsagesHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().usages }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Description</span><br>
                <textarea onchange={ changeDescriptionHandler } rows="6" class="uk-width-1-1" placeholder="Saisissez une valeur">{ facade.getCurrentEntity().description }</textarea>
              </div>
            </fieldset>
            <br>
            <button type="button" onclick={ updateEntityHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large blue-grey darken-2 white-text">Sauver</button>
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
            <button type="button" onclick={ updateEntityHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large blue-grey darken-2 white-text">Sauver</button>
          </form>
        </div>

      </div>
      <div class="uk-width-1-2">

        <div class="uk-panel uk-panel-box">
          <h4>En cours</h4>
        </div>

      </div>
    </div>

  </div>

  <script>

    var self = this;

    self.dotnav = "dotnav1";

    self.on("mount", function() {
      facade.actions.entities.selectCharity(riot.router.current.params.urn)
      .catch(function(error) {
        riot.route("/homepage");
      });
      $(document).arrive(".uk-nestable", self.nestableArrivedHandler);
    });

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

    self.on("selectEntityLoadComplete", function() {
      facade.debugHTML("charity.tag: %s", "selectEntityLoadComplete");
    });

    self.nestableArrivedHandler = function() {
      facade.debugHTML("charity.tag: %s", "nestableArrivedHandler");
      UIkit.nestable($(".uk-nestable"));
    };

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

    changeUsagesHandler(e) {
      facade.getCurrentEntity().usages = e.currentTarget.value;
    };

    changeDescriptionHandler(e) {
      facade.getCurrentEntity().description = e.currentTarget.value;
    };

    updateEntityHandler(e) {
      facade.actions.entities.update(facade.getCurrentEntity());
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
      width: 960px;
    }
    .uk-badge-success {
      width: 28px;
    }
    .uk-badge-danger {
      width: 28px;
    }
  </style>

</charity>
