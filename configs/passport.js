var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

var loginStrategy = new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallBack: true
    },
    function(username, password, done){
        var searchUser = {
            username : username
        };
        User.findOne(searchUser, function(err, user){
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, {
                    success: false,
                    message: 'Wrong email/password'
                });
            }

            if(!user.validPassword(password)){
                return done(null, false, {
                    success: false,
                    message: 'Wrong email/password'
                });
            }

            return done(null, user);

        });
    });

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use('local-login', loginStrategy);
};