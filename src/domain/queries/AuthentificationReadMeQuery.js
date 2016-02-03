"use strict";

var CURRENT_ACTION = 'Query';
var CURRENT_NAME = 'AuthentificationReadMeQuery';
 
module.exports = function(credentials, callback) {
  
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute');
    
    if ( credentials.action===undefined ) return callback('Action is undefined');
    if ( credentials.action!==self.ABIBAO_CONST_TOKEN_AUTH_ME ) return callback('Action is unauthorized');
    
    switch (credentials.scope) {
    
      case self.ABIBAO_CONST_USER_SCOPE_INDIVIDUAL:
        self.r.table('individuals').get(credentials.id).merge(function(individual) {
          return {
            current_charity: self.r.table('entities').get(individual('charity')).pluck('id','name','contact','icon','avatar','picture'),
            charities_history: self.r.table('surveys').filter({'individual':individual('id')})('charity').distinct().map(function(val) {
              return self.r.table('entities').get(val).merge(function(charity) {
                return {
                  me: {
                    total_surveys_completed: self.r.table('surveys').filter({'individual':individual('id'),'charity':charity('id'),'complete':true}).coerceTo('array').count(),
                    total_price_collected: self.r.table('surveys').filter({'individual':individual('id'),'charity':charity('id'),'complete':true}).coerceTo('array').eqJoin('campaign',self.r.table('campaigns')).zip().sum('price'),
                  },
                  total_individuals: self.r.table('surveys').filter({'charity':charity('id')}).coerceTo('array').count(),
                  total_surveys_completed: self.r.table('surveys').filter({'charity':charity('id'),'complete':true}).coerceTo('array').count(),
                  total_price_collected: self.r.table('surveys').filter({'charity':charity('id'),'complete':true}).coerceTo('array').eqJoin('campaign',self.r.table('campaigns')).zip().sum('price'),
                };
              }).pluck('id','name','me', 'total_individuals','total_price_collected','total_surveys_completed');
            }),
            surveys_completed: self.r.table('surveys').filter({'individual':individual('id'),'complete':true})('id').coerceTo('array'),
            surveys_in_progress: self.r.table('surveys').filter({'individual':individual('id'),'complete':false}).coerceTo('array').merge(function(survey) {
              return {
                campaign: self.r.table('campaigns').get(survey('campaign')).pluck('id','name','price','currency'),
                company: self.r.table('entities').get(survey('company'))('name'),
                charity: self.r.table('entities').get(survey('charity'))('name'),
                nb_items: self.r.table('campaigns_items').filter({'campaign':survey('campaign')}).count(),
                nb_answers: survey('answers').keys().count()
              };
            }).pluck('id','campaign','company','charity','modifiedAt','nb_items','nb_answers','answers','complete')
          };
        }).pluck('id','email','charities_history','current_charity','surveys_in_progress','surveys_completed')
        .then(function(individual) {
          individual.news = [];
          individual.news.push ({
            id: '000000000000000000',
            title: 'Titre de news 1',
            type: 'ABIBAO_CONST_NEWS_FROM_ABIBAO',
            image: 'images/news/default.png',
            description: '<p>Phasellus molestie, orci nec aliquam fermentum, nisl leo ultrices velit, sed suscipit risus augue ut nisi.</p> Ut vestibulum, erat eget pharetra finibus, risus urna viverra nunc, eu euismod turpis sem ac turpis. In laoreet ullamcorper vehicula. Phasellus nunc tortor, commodo nec iaculis non, consequat vitae neque. Aliquam nec erat elementum, dictum magna non, suscipit dolor. Donec sodales aliquam lectus non ultricies. Nulla nec luctus nulla, eget viverra purus. Phasellus volutpat erat a lectus viverra aliquam. ',
          });
          callback(null, individual);
        })
        .catch(function(error) {
          callback(error, null);
        });
        break;

      case self.ABIBAO_CONST_USER_SCOPE_ADMINISTRATOR:
        self.SystemReadDataQuery(self.AdministratorModel, credentials.id).then(function(administrator) {
          delete administrator.hashedPassword;
          delete administrator.salt;
          callback(null, administrator);
        })
        .catch(function(error) {
          callback(error, null);
        });
        break;
        
      default:
        callback('Scope is unauthorized', null);
        break;
    }
    
  } catch (e) {
    callback(e, null);
  }

};