"use strict";

exports.me = {
  auth: 'jwt',
  tags: ['api', 'auth'],
  description: 'Savoir qui je suis lorsque je suis connecté.',
  notes: 'Savoir qui je suis lorsque je suis connecté.',
  handler: function(request, reply) {
    reply(request.auth.credentials);
  }
};