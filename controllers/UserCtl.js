'use strict';
var crypto = require('crypto');
var q = require('q');
var User = require('../models/User');

var userController = function(){
    var createUser = function(username, email, fields){
        var deferred = q.defer();
        userExist(username).then(function(hasUser){
            if(hasUser){
                return deferred.reject(new Error('User already Exist'));
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
                return deferred.resolve(newUser.toJSON());
            });
        }, function(err){
            console.error(err);
            return err;
        });

        return deferred.promise;
    };

    var userExist = function(username){
        var deferred = q.defer();
        User.find({username: username}, function(err, user){
            if(err){
                deferred.reject(err);
            }

            if(!user || user.length == 0)
                deferred.resolve(false);
            else
                deferred.resolve(true);

        });

        return deferred.promise;
    };

    return {
        createUser : createUser,
        userExist: userExist
    };
};

module.exports = userController;