var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

for ( var i=1;i<100;i++ ) {
  console.log(new ObjectId().toString());
}