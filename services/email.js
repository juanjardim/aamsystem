var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../configs/config');

exports.sendMail = function(msg, email){
    var transporter = nodemailer.createTransport(smtpTransport({

    }))
};