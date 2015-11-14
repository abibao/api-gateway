<individuals-list>
  
  <!-- layout -->
  <h3>{ title }</h3>
  <ul>
    <li each={ user, i in facade.individuals }>{ user.email } - { user.id }</li>
  </ul>

  <!-- style -->
  <style scoped>
  </style>
  
  <!-- logic -->
  <script>
    var self = this;
  
    self.title = 'INDIVIDUALS';
    
    self.on('mount', function() {
  	  console.log('individuals-list.tag','mounted');
  	  facade.tags['individuals-list'] = self; // put reference in the facade
    });
    
    self.on('update', function() {
      console.log('homepage.tag', 'updated');
    });
    
  </script>

</individuals-list>