'use strict';
var User = require('../models/User');
var q = require('q');
var Group = require('../models/Group');
var _ = require('underscore');


var groupController = function () {
    var createGroup = function (name, description) {
        var deferred = q.defer();

        getGroupByName(name).then(function (group) {
            if (!_.isNull(group)) {
                return deferred.reject('Group already exist');
            }

            var newGroup = new Group({
                name: name,
                description: description,
                status: 'ACTIVE'
            });

            newGroup.save(function (err, group) {
                if (err) {
                    return deferred.reject(err);
                }
                return deferred.resolve(group);
            });

        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    var getGroupByName = function (name) {
        var deferred = q.defer();
        if (_.isNull(name)) {
            deferred.reject('Group Name is needed');
            return deferred.promise;
        }

        Group.findOne({name: name}, function (err, group) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(group);
            }
        });

        return deferred.promise;
    };

    var getGroupById = function (id) {
        var deferred = q.defer();
        if (_.isNull(id)) {
            deferred.reject('Invalid Id');
            return deferred.promise;
        }

        Group.findById(id, function (err, group) {
            if (err) {
                return deferred.reject(err);
            }
            if(_.isNull(group)){
                return deferred.reject('Group not found');
            }
            return deferred.resolve(group);
        });
        return deferred.promise;
    };

    var getAllGroups = function () {
        var deferred = q.defer();
        Group.find(function (err, groups) {
            if (err) {
                return deferred.reject(err);
            }
            return deferred.resolve(groups)
        });
        return deferred.promise;
    };

    var changeGroupStatus = function (id, status) {
        var deferred = q.defer();
        if (_.isNull(id)) {
            deferred.reject('Group Id cannot be null');
            return deferred.promise;
        }

        if (_.isNull(status)) {
            deferred.reject('Status cannot be null');
            return deferred.promise;
        }
        getGroupById(id).then(function (group) {
            group.status = status;
            group.save(function (err, group) {
                if (err) {
                    return deferred.reject(err);
                }
                return deferred.resolve(group);
            });
        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    var addPermissionToGroup = function (id, permission) {
        var deferred = q.defer();
        if (_.isNull(id)) {
            deferred.reject('Group Id cannot be null');
            return deferred.promise;
        }
        if (_.isNull(permission)) {
            deferred.reject('Permission cannot be null');
            return deferred.promise;
        }

        getGroupById(id).then(function (group) {
            if (group.permissions.indexOf(permission._id) > -1) {
                return deferred.reject('Group already has this permission');
            }
            group.permissions.push(permission);
            group.save(function (err, group) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(group);
            });
        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    var removePermissionToGroup = function (id, permission) {
        var deferred = q.defer();
        var promise = deferred.promise;
        if (_.isNull(id)) {
            deferred.reject('Group Id cannot be null');
            return promise;
        }

        if (_.isNull(permission)) {
            deferred.reject('Permission cannot be null');
            return promise;
        }

        getGroupById(id).then(function (group) {
            if(_.isNull(group)){
                return deferred.reject('Group not found');
            }

            if (group.permissions.indexOf(permission._id) === -1) {
                return deferred.reject('Group does not have this permission');
            }
            group.permissions.pop(permission);
            group.save(function (err, group) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(group);
            });
        }, function (err) {
            deferred.reject(err);
        });

        return promise;
    };

    var getAllGroupsByIds = function (ids) {
        var deferred = q.defer();
        var promise = deferred.promise;
        if (_.isNull(ids)) {
            deferred.resolve([]);
            return promise;
        }

        Group.find({_id: {$in: ids}}, function (err, groups) {
            if (err) {
                return deferred.reject(err);
            }
            deferred.resolve(groups);
        });

        return promise;
    };

    var getUserGroups = function (req, res, user) {
        getAllGroupsByIds(user.groups).then(function (groups) {
            user = user.toJSON();
            user.groups = groups;
            res.status(200).json({user: user});
        }, function (err) {
            res.status(500).json({error: err});
        });
    };

    return {
        createGroup: createGroup,
        getGroupByName: getGroupByName,
        getGroupById: getGroupById,
        getAllGroups: getAllGroups,
        changeGroupStatus: changeGroupStatus,
        addPermissionToGroup: addPermissionToGroup,
        removePermissionToGroup: removePermissionToGroup,
        getAllGroupsByIds: getAllGroupsByIds,
        getUserGroups: getUserGroups
    };
};

module.exports = groupController();