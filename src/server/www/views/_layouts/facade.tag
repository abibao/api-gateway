<Facade>

  <script>
    
    var self = this;
    self.name = "error404";

    self.on("mount", function() {
      facade.tags[self.name] = self;
      facade.debug("tags list %o", facade.tags);
      facade.start();
    });
    
    self.on("update", function() {
    });
    
  </script>

</Facade>