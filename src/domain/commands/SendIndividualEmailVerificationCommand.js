"use strict";

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.ABIBAO_API_GATEWAY_SERVER_MAILER_USERNAME,
        pass: process.env.ABIBAO_API_GATEWAY_SERVER_MAILER_PASSWORD
    }
});

module.exports = function(email, callback) {
 
  var self = this;
  self.action = 'Command';
  self.name = 'SendIndividualEmailVerificationCommand';
  
  var mailOptions = {
    from: process.env.ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_NAME+' <'+process.env.ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_EMAIL+'>',
    to: email,
    subject: '[abibao.com] - vérification de votre email',
    text: 'http://www.abibao.com',
    html: '<a href="http://abibao.com/accounts/verify">Cliquez ici pour vérification de votre email.</a>'
  };
  
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) return callback(error);
    self.logger.info(info);
    self.SendIndividualEmailVerificationEvent(email);
    callback();
  });
  
};