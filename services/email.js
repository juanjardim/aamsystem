var nodemailer = require('nodemailer');
var config = require('../configs/config');

var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
    auth: {
        api_key: config.apiKey
    }
};

exports.sendMail = function(msg, email, subject, cb){
    var client = nodemailer.createTransport(sgTransport(options));
    var email = {
        from: 'ammsystem@dummy.com',
        to: email,
        subject: subject,
        text: msg
    };
    if(process.env.NODE_ENV !== "testing")
        client.sendMail(email, cb);
    else if(cb != undefined)
        cb();
};

