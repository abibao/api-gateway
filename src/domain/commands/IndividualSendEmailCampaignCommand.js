"use strict";

var Iron = require('iron');
var Base64 = require('base64-url');
var nodemailer = require('nodemailer');

var CURRENT_ACTION = 'Command';
var CURRENT_NAME = 'IndividualSendEmailCampaignCommand';

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.ABIBAO_API_GATEWAY_SERVER_MAILER_USERNAME,
        pass: process.env.ABIBAO_API_GATEWAY_SERVER_MAILER_PASSWORD
    }
});

module.exports = function(params, callback) {
 
  var self = this;
  
  try {
    
    self.logger.debug(CURRENT_ACTION, CURRENT_NAME, 'execute', params.email);
    
    var unsealed = params;
    unsealed.action = self.ABIBAO_CONST_TOKEN_CAMPAIGN_PUBLISH;
    Iron.seal(unsealed, process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY, Iron.defaults, function (err, sealed) {
      if (err) return callback(err, null);
      sealed = Base64.encode(sealed);
      var mailOptions =  {
        from: process.env.ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_NAME+' <'+process.env.ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_EMAIL+'>',
        to: params.email,
        subject: '[abibao.com] - un sondage est disponible',
        text: process.env.ABIBAO_DASHBOARD_URI+'/surveys/assign/'+sealed,
        html: '<a href="'+process.env.ABIBAO_WWW_URI+'/surveys/assign/'+sealed+'">Cliquez ici pour commencer le sondage.</a>'
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) return callback(error, null);
        if (!info) return callback('no informations found', null);
        callback(null, true);
      });
    });
  
  } catch (e) {
    callback(e, null);
  }
  
};