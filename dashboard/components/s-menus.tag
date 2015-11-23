<s-menus>
  
  <!-- layout -->
  <div class="ui inverted labeled icon left inline vertical sidebar menu cyan lighten-2 white-text left">
    <a class="item">
      <i class="home icon"></i>
      Home
    </a>
    <a class="item">
      <i class="block layout icon"></i>
      Topics
    </a>
    <a class="item">
      <i class="smile icon"></i>
      Friends
    </a>
    <a class="item">
      <i class="calendar icon"></i>
      History
    </a>
  </div>
  
  <!-- style -->
  <style scoped>
    
  </style>
  
  <!-- logic -->
  <script>
    var self = this;
    
    // riot events
    
    self.on('before-mount', function() {
      // déclenché avant que le tag soit monté
      console.log('s-menus', 'before-mount');
    });
  
    self.on('mount', function() {
      // déclenché une fois le tag monté sur la page
      console.log('s-menus', 'mount');
      // initialize plugins jquery
      $('.context .ui.sidebar')
      .sidebar({
        context: $('.context.container .bottom.segment')
      })
      .sidebar('attach events', '.sidebar.icon');
      $('#page').show();
      $('#loader').hide();
    });
  
    self.on('update', function() {
      // permet de recalculer les données de contexte avant la mise à jour
      console.log('s-menus', 'update');
    });
  
    self.on('updated', function() {
      // déclenché une fois le tag mis à jour
      console.log('s-menus', 'updated');
    });
  
    self.on('before-unmount', function() {
      // déclenché avant le tag soit retiré de la page
      console.log('s-menus', 'before-unmount');
    });
  
    self.on('unmount', function() {
      // déclenché après que le tag soit retiré de la page
      console.log('s-menus', 'unmount');
    });
    
    
  </script>
  
</s-menus>