'use strict';
var crypto = require('crypto');
var q = require('q');
var User = require('../models/User');
var Email = require('../services/email');
var validator = require('validator');

var userController = function(){
    var createUser = function(username, email, fields){
        var deferred = q.defer();
        if(username == undefined) {
            deferred.reject("Username is needed");
            return deferred.promise;
        }

        if(!validator.isEmail(email)){
            deferred.reject("Invalid e-mail");
            return deferred.promise;
        }

        getUserByUsername(username).then(function(user){
            if(user !== null){
                return deferred.reject('User already Exist');
            }
            var generatedPassword = crypto.randomBytes(5).toString('hex');
            var newUser = new User({
                username: username,
                email: email,
                fields: fields,
                password: generatedPassword,
                status: "ACTIVE"
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

    var getUserByUsername = function(username){
        var deferred = q.defer();
        if(validator.isNull(username)){
            deferred.reject('Username is needed');
            return deferred.promise;
        }
        User.findOne({username: username}, function(err, user){
            if(err){
               deferred.reject(err);
            }else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    };

    var getUserById = function(userId){
        var deferred = q.defer();
        if(validator.isNull(userId)){
            deferred.reject('User id is needed');
            return deferred.promise;
        }
        User.findOne({_id: userId}, function(err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
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

    var deactivateUser = function(userId){
        var deferred = q.defer();
        this.getUserById(userId).then(function(user){
            if(validator.isNull(user)){
                return deferred.reject('User not found');
            }
            user.status = 'INACTIVE';

            user.save(function(err, user){
                if(err){
                    return deferred.reject(err);
                }
                return deferred.resolve(user.toJSON());
            });
        });
        return deferred.promise;
    };

    var changePassword = function(userId, newPassword){
        var deferred = q.defer();
        if(validator.isNull(userId)){
            deferred.reject("User ID is needed");
            return deferred.promise;
        }

        if(validator.isNull(newPassword)){
            deferred.reject("Password is needed");
            return deferred.promise;
        }

        if(!(/^[a-zA-Z]\w{3,14}$/.test(newPassword))){
            deferred.reject("Invalid Password, should have at least 4 characters and start with an letter");
            return deferred.promise;
        }

        this.getUserById(userId).then(function(user){
            if(validator.isNull(user)){
                return deferred.reject('User not found');
            }
            user.password = newPassword;
            user.save(function(err){
                return deferred.resolve("Password changed");
            });
        });
        return deferred.promise;
    };

    return {
        createUser : createUser,
        getUserByUsername: getUserByUsername,
        getUserById: getUserById,
        getAllUsers: getAllUsers,
        deactivateUser: deactivateUser,
        changePassword : changePassword
    };
};

module.exports = userController;