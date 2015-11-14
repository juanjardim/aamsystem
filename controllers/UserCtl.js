'use strict';
var crypto = require('crypto');
var q = require('q');
var _ = require('underscore');
var User = require('../models/User');
var Email = require('../services/email');
var validator = require('validator');

var userController = function () {
    var createUser = function (username, email, fields, roles) {
        var deferred = q.defer();
        if (_.isNull(username)) {
            deferred.reject("Username is needed");
            return deferred.promise;
        }

        if (!validator.isEmail(email)) {
            deferred.reject("Invalid e-mail");
            return deferred.promise;
        }

        if( _.isUndefined(roles) ||_.isNull(roles)  || roles.length === 0){
            roles = ['User'];
        }

        getUserByUsername(username).then(function (user) {
            if (user !== null) {
                return deferred.reject('User already Exist');
            }
            var generatedPassword = crypto.randomBytes(5).toString('hex');
            var newUser = new User({
                username: username,
                email: email,
                fields: fields,
                password: generatedPassword,
                status: 'ACTIVE',
                roles : roles
            });

            newUser.save(function (err) {
                if (err) {
                    return deferred.reject(err);
                }
                Email.sendMail("Congratulations this is your password: " + generatedPassword, email, "AMMSystem password request");
                return deferred.resolve(newUser.toJSON());
            });
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    var getUserByUsername = function (username) {
        var deferred = q.defer();
        if (validator.isNull(username)) {
            deferred.reject('Username is needed');
            return deferred.promise;
        }
        User.findOne({username: username}, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    };

    var getUserById = function (userId) {
        var deferred = q.defer();
        if (validator.isNull(userId)) {
            deferred.reject('User id is needed');
            return deferred.promise;
        }
        User.findOne({_id: userId}, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                if(validator.isNull(user)){
                    return deferred.reject('User not exist');
                }
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    };

    var getAllUsers = function () {
        var deferred = q.defer();
        User.find({}, {password: 0}, function (err, users) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(users);
        });
        return deferred.promise;
    };

    var changeUserStatus = function (userId, status) {
        var deferred = q.defer();
        getUserById(userId).then(function (user) {
            if (validator.isNull(user)) {
                return deferred.reject('User not found');
            }
            user.status = status;
            user.save(function (err, user) {
                if (err) {
                    return deferred.reject(err);
                }
                return deferred.resolve(user.toJSON());
            });
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    var changePassword = function (userId, newPassword) {
        var deferred = q.defer();
        if (validator.isNull(userId)) {
            deferred.reject("User ID is needed");
            return deferred.promise;
        }

        if (validator.isNull(newPassword)) {
            deferred.reject("Password is needed");
            return deferred.promise;
        }

        if (!(/^[a-zA-Z]\w{3,14}$/.test(newPassword))) {
            deferred.reject("Invalid Password, should have at least 4 characters and start with an letter");
            return deferred.promise;
        }

        getUserById(userId).then(function (user) {
            if (validator.isNull(user)) {
                return deferred.reject('User not found');
            }
            user.password = newPassword;
            user.save(function (err) {
                if (err) {
                    return deferred.reject(err);
                }
                return deferred.resolve("Password changed");
            });
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    var resetPassword = function (userId) {
        var deferred = q.defer();
        if (validator.isNull(userId)) {
            deferred.reject('User Id cannot be null');
            return deferred.promise;
        }
        getUserById(userId).then(function (user) {
            if (validator.isNull(user)) {
                return deferred.reject('Invalid User');
            }
            var generatedPassword = crypto.randomBytes(5).toString('hex');
            user.password = generatedPassword;
            user.save(function (err, user) {
                if (err) {
                    return deferred.reject(err);
                }
                Email.sendMail("Congratulations this is your password: " + generatedPassword, user.email, "AMMSystem password request");
                return deferred.resolve("Password reset");
            });

        }, function (err) {
            return deferred.reject(err);
        });
        return deferred.promise;
    };

    var addGroupToUser = function (userId, group) {
        var deferred = q.defer();
        if (validator.isNull(userId)) {
            deferred.reject('User Id cannot be null');
            return deferred.promise;
        }
        if (validator.isNull(group)) {
            deferred.reject('Group cannot be null');
            return deferred.promise;
        }
        getUserById(userId).then(function (user) {
            if (user.groups.indexOf(group._id) > -1) {
                return deferred.reject('User is already in this group');
            }
            user.groups.push(group);
            user.save(function (err, user) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(user);
            });
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    var removeGroupToUser = function (userId, group) {
        var deferred = q.defer();
        if (validator.isNull(userId)) {
            deferred.reject('User Id cannot be null');
            return deferred.promise;
        }
        if (validator.isNull(group)) {
            deferred.reject('Group cannot be null');
            return deferred.promise;
        }
        getUserById(userId).then(function (user) {
            if (user.groups.indexOf(group._id) === -1) {
                return deferred.reject('User is not in this group');
            }
            user.groups.pop(group);
            user.save(function (err, user) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(user);
            });
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    var addPermissionToUser = function (userId, permission) {
        var deferred = q.defer();
        if (validator.isNull(userId)) {
            deferred.reject('User Id cannot be null');
            return deferred.promise;
        }

        if (validator.isNull(permission)) {
            deferred.reject('Permission cannot be null');
            return deferred.promise;
        }

        getUserById(userId).then(function (user) {
            if (user.permissions.indexOf(permission._id) > -1) {
                return deferred.reject('User already have this permission');
            }
            user.permissions.push(permission);
            user.save(function (err, user) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(user);
            });
        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    var removePermissionToUser = function(userId, permission){
        var deferred = q.defer();
        if (validator.isNull(userId)) {
            deferred.reject('User Id cannot be null');
            return deferred.promise;
        }

        if (validator.isNull(permission)) {
            deferred.reject('Permission cannot be null');
            return deferred.promise;
        }
        getUserById(userId).then(function (user) {
            if (user.permissions.indexOf(permission._id) === -1) {
                return deferred.reject('User does not have this permission');
            }
            user.permissions.pop(permission);
            user.save(function (err, user) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(user);
            });
        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };


    var addApplicationToUser = function(userId, application){
        var deferred = q.defer();
        var promise = deferred.promise;
        if (validator.isNull(userId)) {
            deferred.reject('User Id cannot be null');
            return promise;
        }

        if (validator.isNull(application)) {
            deferred.reject('Application cannot be null');
            return promise;
        }

        getUserById(userId).then(function (user) {
            if (user.authorizedApplications.indexOf(application._id) > -1) {
                return deferred.reject('User already have this application');
            }
            user.authorizedApplications.push(application);
            user.save(function (err, user) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(user);
            });
        }, function (err) {
            deferred.reject(err);
        });

        return promise;
    };

    var removeApplicationToUser = function(userId, application){
        var deferred = q.defer();
        var promise = deferred.promise;
        if (validator.isNull(userId)) {
            deferred.reject('User Id cannot be null');
            return promise;
        }

        if (validator.isNull(application)) {
            deferred.reject('Application cannot be null');
            return promise;
        }
        getUserById(userId).then(function (user) {
            if (user.authorizedApplications.indexOf(application._id) === -1) {
                return deferred.reject('User does not have this application');
            }
            user.authorizedApplications.pop(application);
            user.save(function (err, user) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(user);
            });
        }, function (err) {
            deferred.reject(err);
        });

        return promise;
    };

    var getUsersByApplicationId = function(applicationId){
        var deferred = q.defer();
        var promise = deferred.promise;

        User.find({authorizedApplications: applicationId}, function (err, users) {
            if (err) {
                return deferred.reject(err);
            }
            deferred.resolve(users);
        });

        return promise;
    };

    return {
        createUser: createUser,
        getUserByUsername: getUserByUsername,
        getUserById: getUserById,
        getAllUsers: getAllUsers,
        changeUserStatus: changeUserStatus,
        changePassword: changePassword,
        addGroupToUser: addGroupToUser,
        removeGroupToUser: removeGroupToUser,
        resetPassword: resetPassword,
        addPermissionToUser: addPermissionToUser,
        removePermissionToUser : removePermissionToUser,
        addApplicationToUser : addApplicationToUser,
        removeApplicationToUser : removeApplicationToUser,
        getUsersByApplicationId : getUsersByApplicationId

    };
};

module.exports = userController();