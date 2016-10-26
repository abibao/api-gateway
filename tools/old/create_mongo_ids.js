'use strict'

var bson = require('bson')
var ObjectId = bson.ObjectId

for (var i = 1; i < 100; i++) {
  console.log(new ObjectId().toString())
}
