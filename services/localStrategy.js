'use strict';
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

var strategyOptions = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallBack: true
};

exports.login = new LocalStrategy(strategyOptions,
    function(username, password, done){
        var searchUser = {username : username};
        User.findOne(searchUser, function(err, user){
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, {
                    success: false,
                    error : 'Wrong email/password'
                });
            }

            if(user.status !== 'ACTIVE'){
                return done(null, false, {
                    success: false,
                    error: 'User inactive, please contact admin'
                });
            }

            user.comparePassword(password, function (err, isMatch) {
                if(err){
                    return done(err);
                }
                if (!isMatch) {
                    return done(null, false, {
                        success: false,
                        error : 'Wrong email/password'
                    });
                }
                return done(null, user);
            });
        });
    }
);

