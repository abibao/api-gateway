'use strict'

var couchbase = require('couchbase')
var cluster = new couchbase.Cluster('couchbase://localhost/')
var bucket = cluster.openBucket('default')
var N1qlQuery = couchbase.N1qlQuery

bucket.manager().createPrimaryIndex(() => {
  bucket.upsert('user:king_arthur', {
    'email': 'kingarthur@couchbase.com', 'interests': ['Holy Grail', 'African Swallows']
  },
  (error, result) => {
    console.log(error)
    bucket.get('user:king_arthur', (error, result) => {
      console.log(error)
      console.log('Got result: %j', result.value)
      bucket.query(
        N1qlQuery.fromString('SELECT * FROM default WHERE $1 in interests LIMIT 1'),
        ['African Swallows'],
        function (error, rows) {
          console.log(error)
          console.log('Got rows: %j', rows)
        })
    })
  })
})
