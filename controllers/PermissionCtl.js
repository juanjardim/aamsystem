'use strict';
var q = require('q');
var validator = require('validator');
var Permission = require('../models/Permission');

var permissionController = function () {

    var createPermission = function (name, description, application) {
        var deferred = q.defer();
        var promise = deferred.promise;
        if (validator.isNull(name)) {
            deferred.reject('Name cannot be null');
            return promise;
        }

        if (validator.isNull(description)) {
            deferred.reject('Description cannot be null');
            return promise;
        }

        if(validator.isNull(application)){
            deferred.reject('Application cannot be null');
            return promise;
        }

        getPermissionByName(name).then(function (permission) {
            if (!validator.isNull(permission)) {
                return deferred.reject('Permission already exist');
            }

            var newPermission = new Permission({
                name: name,
                description: description,
                status: 'ACTIVE',
                application: application
            });

            newPermission.save(function (err, permission) {
                if (err) {
                    return deferred.reject(err);
                }
                return deferred.resolve(permission);
            });
        }, function (err) {
            deferred.reject(err);
        });

        return promise;
    };

    var getPermissionByName = function (name) {
        var deferred = q.defer();
        if (validator.isNull(name)) {
            deferred.reject('Permission Name cannot be null');
            return deferred.promise;
        }

        Permission.findOne({name: name}, function (err, permission) {
            if (err) {
                return deferred.reject(err);
            }
            deferred.resolve(permission);
        });

        return deferred.promise;
    };

    var getPermissionById = function (id) {
        var deferred = q.defer();
        if (validator.isNull(id)) {
            deferred.reject('Permission ID cannot be null');
            return deferred.promise;
        }

        Permission.findById(id, function (err, permission) {
            if (err) {
                return deferred.reject(err);
            }
            return deferred.resolve(permission);
        });

        return deferred.promise;
    };

    var changePermissionStatus = function (id, status) {
        var deferred = q.defer();
        if (validator.isNull(id)) {
            deferred.reject('Permission Id cannot be null');
            return deferred.promise;
        }

        if (validator.isNull(status)) {
            deferred.reject('Status cannot be null');
            return deferred.promise;
        }
        getPermissionById(id).then(function (permission) {
            permission.status = status;
            permission.save(function (err, permission) {
                if (err) {
                    return deferred.reject(err);
                }
                return deferred.resolve(permission);
            });

        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    var getAllPermissions = function () {
        var deferred = q.defer();
        Permission.find(function (err, permissions) {
            if (err) {
                return deferred.reject(err);
            }
            return deferred.resolve(permissions);
        });
        return deferred.promise;
    };

    var getPermissionsById = function (ids) {
        var deferred = q.defer();
        var promise = deferred.promise;

        if (validator.isNull(ids)) {
            deferred.resolve([]);
            return promise;
        }

        Permission.find({_id: {$in: ids}}, function (err, permissions) {
            if (err) {
                return deferred.reject(err);
            }
            deferred.resolve(permissions);
        });

        return promise;
    };

    var getUserPermissions = function(req, res, user){
        getPermissionsById(user.permissions).then(function(permissions){
            user = user.toJSON();
            user.permissions = permissions;
            res.status(200).json({user: user});
        }, function(err){
            res.status(500).json({error: err});
        });
    };

    return {
        getPermissionById: getPermissionById,
        getPermissionByName: getPermissionByName,
        createPermission: createPermission,
        changePermissionStatus: changePermissionStatus,
        getAllPermissions: getAllPermissions,
        getPermissionsById: getPermissionsById,
        getUserPermissions : getUserPermissions
    };
};

module.exports = permissionController();