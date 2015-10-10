'use strict';
var crypto = require('crypto');
var q = require('q');
var User = require('../models/User');
var Email = require('../services/email');

var userController = function(){
    var createUser = function(username, email, fields){
        var deferred = q.defer();
        getUser(username).then(function(hasUser){
            if(hasUser !== null){
                return deferred.reject('User already Exist');
            }
            var generatedPassword = crypto.randomBytes(5).toString('hex');
            var newUser = new User({
                username: username,
                email: email,
                fields: fields,
                password: generatedPassword
            });

            newUser.save(function(err){
                if(err){
                    return deferred.reject(err);
                }
                Email.sendMail("Congratulations this is your password: " + generatedPassword, email, "AMMSystem password request");
                return deferred.resolve(newUser.toJSON());
            });
        }, function(err){
            console.error(err);
            return err;
        });
        return deferred.promise;
    };

    var getUser = function(username){
        var deferred = q.defer();
        User.findOne({username: username}, function(err, user){
            if(err){
                deferred.reject(err);
            }
            if(user === null)
                deferred.resolve(null);
            else
                deferred.resolve(user);
        });
        return deferred.promise;
    };

    var getAllUsers = function(){
        var deferred = q.defer();
        User.find({}, {password: 0}, function(err, users){
            if(err){
                deferred.reject(err);
            }
            deferred.resolve(users);
        });
        return deferred.promise;
    };

    return {
        createUser : createUser,
        getUser: getUser,
        getAllUsers: getAllUsers
    };
};

module.exports = userController;