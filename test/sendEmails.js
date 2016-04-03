"use strict";

var nodemailer = require("nodemailer");

var nconf = require("nconf");
nconf.argv().env().file({ file: 'nconf-env.json' });

console.dir(nconf.get("ABIBAO_API_GATEWAY_SERVER_MAILER_HOST"));

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  logger: true,
  debug: true,
  pool: true,
  secure: false,
  connectionTimeout: 4000,
  host: nconf.get("ABIBAO_API_GATEWAY_SERVER_MAILER_HOST"),
  port: nconf.get("ABIBAO_API_GATEWAY_SERVER_MAILER_PORT"),
  auth: {
    user: nconf.get("ABIBAO_API_GATEWAY_SERVER_MAILER_USERNAME"),
    pass: nconf.get("ABIBAO_API_GATEWAY_SERVER_MAILER_PASSWORD")
  }
});

var mailOptions =  {
  from: nconf.get("ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_NAME")+" <"+nconf.get("ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_EMAIL")+">",
  to: "gperreymond@gmail.com, boitaumail@gmail.com, boitaumail@yahoo.fr, legobit22@gmail.com",
  subject: "[abibao.com] - un sondage est disponible",
  text: "tests unitaires d'envoie d'email.",
  html: "tests unitaires d'envoie d'email.",
};

console.dir(mailOptions);

transporter.sendMail(mailOptions, function(error, info) {
  if (error) { return console.dir(error); }
  if (!info) { return console.dir(new Error("no informations found") ); }
  console.dir(info);
  process.exit(0);
});