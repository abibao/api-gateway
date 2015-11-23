<s-individuals-shortlist>
  
  <!-- layout -->
  <div>
    <p> </p>
    <h4 class="ui header">Liste des utilisateurs</h4>
    <p>
      Ce composant permet d'obtenir la liste complète des utilisateurs en version non détaillées.
    </p>
    <div class="ui form">
      <div class="two wide field">
        <select class="ui dropdown">
          <option value="10">10</option>
          <option value="20" selected>20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
    <table class="ui celled table">
      <thead>
        <tr>
          <th data-field="id" class="cyan lighten-2 white-text">ID</th>
          <th data-field="email" class="cyan lighten-2 white-text">EMAIL</th>
          <th data-field="createdAt" class="cyan lighten-2 white-text">DATE</th>
        </tr>
      </thead>
      <tbody>
        <tr each={ binding.dataProvider } no-reorder>
          <td>{ id }</td>
          <td>{ email }</td>
          <td>{ createdAt }</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="3" class="cyan lighten-2">
            <div class="ui pagination menu">
              <a class="icon item">
                <i class="left chevron icon"></i>
              </a>
              <a class="item">1</a>
              <a class="item">2</a>
              <a class="item">3</a>
              <a class="item">4</a>
              <a class="icon item">
                <i class="right chevron icon"></i>
              </a>
            </div>
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
  <!-- style -->
  <style scoped>
    .ui.celled.table tr td {
      padding: 0.5em;
    }
  </style>
  
  <!-- logic -->
  <script>
    var self = this;
    
    // static configuration
    
    self.configuration = {
      ReadShortIndividualListQuery: 'http://gperreymond-abibao.c9.io/individuals/shortlist'
    };
    
    // data binding flex style
    
    self.binding = {
      dataProvider: [],
      maxRecords: 0,
      total: 0,
      progress: 0
    };
    riot.observable(self.binding);
    
    // socket events
    
    /** self.on('SocketIndividualCreated', function(data) {
      console.log('s-individuals-shortlist', 'SocketIndividualCreated', data);
      self.binding.dataProvider[data.id] = data;
      self.update();
    });
    
     self.on('SocketIndividualUpdated', function(data) {
      console.log('s-individuals-shortlist', 'SocketIndividualUpdated', data);
      self.binding.dataProvider[data.id] = data;
      self.update();
    }); **/
    
    // riot events
    
    self.on('before-mount', function() {
      // déclenché avant que le tag soit monté
      console.log('s-individuals-shortlist', 'before-mount');
    });
  
    self.on('mount', function() {
      // déclenché une fois le tag monté sur la page
      console.log('s-individuals-shortlist', 'mount');
      // add reference to facade
      facade.tags['s-individuals-shortlist'] = self;
      // initialize bindings
      self.binding.maxRecords = 15;
      self.binding.total = 0;
      self.binding.dataProvider = [];
      $.post(self.configuration.ReadShortIndividualListQuery, {startIndex:1,nbIndexes:self.binding.maxRecords}, function(result) {
        _.each(result.documents, function(item, i) {
          self.binding.dataProvider.push({
            id: item.id,
            email: item.email, 
            createdAt: item.createdAt
          });
        });
        self.binding.total = result.total;
        self.update();
      });
    });
    
    var filterRows = function(rows) {
      var results = [];
      _.each(rows, function(item, i) {
        if(item.active) results.push(item.markup)
      });
      return results;
    }
    
    self.on('update', function() {
      // permet de recalculer les données de contexte avant la mise à jour
      console.log('s-individuals-shortlist', 'update');
    });
  
    self.on('updated', function() {
      // déclenché une fois le tag mis à jour
      console.log('s-individuals-shortlist', 'updated');
    });
  
    self.on('before-unmount', function() {
      // déclenché avant le tag soit retiré de la page
      console.log('s-individuals-shortlist', 'before-unmount');
    });
  
    self.on('unmount', function() {
      // déclenché après que le tag soit retiré de la page
      console.log('s-individuals-shortlist', 'unmount');
    });
    
  </script>

</s-individuals-shortlist>
