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

module.exports = function(data) {
 
  var self = this;
  var time_start = new Date();
  var time_end;
  
  return new Promise(function(resolve, reject) {
    try {
      var unsealed = data;
      unsealed.action = self.ABIBAO_CONST_TOKEN_CAMPAIGN_PUBLISH;
      Iron.seal(unsealed, process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY, Iron.defaults, function (err, sealed) {
        if (err) return reject(err);
        sealed = Base64.encode(sealed);
        var mailOptions =  {
          from: process.env.ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_NAME+' <'+process.env.ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_EMAIL+'>',
          to: data.email,
          subject: '[abibao.com] - un sondage est disponible',
          text: process.env.ABIBAO_DASHBOARD_URI+'/surveys/assign/'+sealed,
          html: '<a href="'+process.env.ABIBAO_WWW_URI+'/surveys/assign/'+sealed+'">Cliquez ici pour commencer le sondage.</a>'
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) return reject(error);
          if (!info) return reject('no informations found');
          time_end = new Date();
          self.logger.debug(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
          resolve();
        });
      });
    } catch (e) {
      time_end = new Date();
      self.logger.error(CURRENT_ACTION, CURRENT_NAME, '('+(time_end-time_start)+'ms)');
      reject(e);
    }
  });

};