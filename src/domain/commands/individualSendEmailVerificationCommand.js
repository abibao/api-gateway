"use strict";

var Promise = require("bluebird");
var Iron = require("iron");
var Base64 = require("base64-url");
var nodemailer = require("nodemailer");
var uuid = require("node-uuid");

var nconf = require("nconf");
nconf.argv().env().file({ file: 'nconf-env.json' });

var CURRENT_NAME = "IndividualSendEmailVerificationCommand";

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    pool: true,
    host: nconf.get("ABIBAO_API_GATEWAY_SERVER_MAILER_HOST"),
    port: nconf.get("ABIBAO_API_GATEWAY_SERVER_MAILER_PORT"),
    auth: {
        user: nconf.get("ABIBAO_API_GATEWAY_SERVER_MAILER_USERNAME"),
        pass: nconf.get("ABIBAO_API_GATEWAY_SERVER_MAILER_PASSWORD")
    }
});

module.exports = function(data) {
 
  var self = this;
  var starttime = new Date();
  
  return new Promise(function(resolve, reject) {
    try {
      var unsealed = data;
      unsealed.action = self.ABIBAO_CONST_TOKEN_CAMPAIGN_PUBLISH;
      Iron.seal(unsealed,  nconf.get("ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY"), Iron.defaults, function (err, sealed) {
        if (err) { return reject(err); }
        sealed = Base64.encode(sealed);
        var mailOptions =  {
          from: nconf.get("ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_NAME")+" <"+nconf.get("ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_EMAIL")+">",
          to: data.email,
          subject: "[abibao.com] - un sondage est disponible",
          text:  nconf.get("ABIBAO_WWW_SURVEYS_URI")+"/assign/"+sealed,
          html: "<a href=\""+nconf.get("ABIBAO_WWW_SURVEYS_URI")+"/assign/"+sealed+"\">Cliquez ici pour commencer le sondage.</a>"
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) { return reject(error); }
          if (!info) { return reject( new Error("no informations found") ); }
          
          var request = {
            name: CURRENT_NAME,
            uuid: uuid.v1(),
            exectime: new Date() - starttime
          };
          self.logger.info({command:request}, '[command]');
          
          resolve();
        });
      });
    } catch (e) {
      reject(e);
    }
  });

};