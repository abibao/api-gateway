'use strict';

var CRUDUser = {
  db: process.env.ABIBAO_MONGODB__DATABASE_CONNECTION,
  collection: process.env.ABIBAO_MONGODB__USERS_COLLECTION,
};

var User = require('toothache')(CRUDUser);
module.exports = User;