'use strict';
var q = require('q');
var validator = require('validator');
var _ = require('underscore');

var UserCtl = require('../controllers/UserCtl');
var GroupCtl = require('../controllers/GroupCtl');
var PermissionCtl = require('../controllers/PermissionCtl');
var AppCtl = require('../controllers/ApplicationCtl');

exports.getAllUserInfo = function (userId, applicationId) {
    var deferred = q.defer();
    var promise = deferred.promise;
    var currentUser, userGroups, userPermissions;
    UserCtl.getUserById(userId).then(function (user) {
        currentUser = user;
        return GroupCtl.getAllGroupsByIds(user.groups);
    }).then(function (groups) {
        var permissionsId = currentUser.permissions;
        userGroups = groups;
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            permissionsId = permissionsId.concat(group.permissions);
        }
        permissionsId = _.uniq(permissionsId, function (item, key, a) {
            return item.toString;
        });
        return PermissionCtl.getPermissionsById(permissionsId);
    }).then(function (permissions) {
        userPermissions = [];
        if (applicationId != undefined) {
            userPermissions = _.filter(permissions, function(permission){
                return permission.application.toString() == applicationId;
            });
        } else {
            userPermissions = permissions;
        }
        return AppCtl.getAllApplicationsByIds(currentUser.authorizedApplications);

    }).then(function(applications){
        var userApplications = [];
        if(applicationId != undefined){
            userApplications = _.find(applications, function(application){
                return application.toString() == applicationId;
            });
        } else {
            userApplications = applications;
        }
        var user = currentUser.toJSON();
        user.groups = userGroups;
        user.permissions = userPermissions;
        user.authorizedApplications = userApplications;
        deferred.resolve(user);
    });
    return promise;
};