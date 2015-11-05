'use strict';
var q = require('q');
var _ = require('underscore');
var Permission = require('../models/Permission');

var permissionController = function () {

    var createPermission = function (name, description, application) {
        var deferred = q.defer();
        var promise = deferred.promise;
        if (_.isNull(name)) {
            deferred.reject('Name cannot be null');
            return promise;
        }

        if (_.isNull(description)) {
            deferred.reject('Description cannot be null');
            return promise;
        }

        if(_.isNull(application)){
            deferred.reject('Application cannot be null');
            return promise;
        }

        getPermissionByName(name).then(function (permission) {
            if (!_.isNull(permission)) {
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
        if (_.isNull(name)) {
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
        if (_.isNull(id)) {
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
        if (_.isNull(id)) {
            deferred.reject('Permission Id cannot be null');
            return deferred.promise;
        }

        if (_.isNull(status)) {
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

        if (_.isNull(ids)) {
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

    var getAllPermissionsByApplication = function(applicationId){
        var deferred = q.defer();
        var promise = deferred.promise;
        if(_.isNull(applicationId)){
            deferred.reject('Application Id Cannot be null');
            return promise;
        }

        Permission.find({application : applicationId}, function(err, permissions){
            if(err){
                return deferred.reject(err);
            }
            deferred.resolve(permissions);
        });
        return promise;
    };


    return {
        getPermissionById: getPermissionById,
        getPermissionByName: getPermissionByName,
        createPermission: createPermission,
        changePermissionStatus: changePermissionStatus,
        getAllPermissions: getAllPermissions,
        getPermissionsById: getPermissionsById,
        getAllPermissionsByApplication: getAllPermissionsByApplication
    };
};

module.exports = permissionController();