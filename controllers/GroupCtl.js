'use strict';
var User = require('../models/User');
var q = require('q');
var Group = require('../models/Group');
var validator = require('validator');


var groupController = function () {
    var createGroup = function (name, description) {
        var deferred = q.defer();

        getGroupByName(name).then(function (group) {
            if (!validator.isNull(group)) {
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
        if (validator.isNull(name)) {
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
        if (validator.isNull(id)) {
            deferred.reject('Invalid Id');
            return deferred.promise;
        }

        Group.findById(id, function (err, group) {
            if (err) {
                return deferred.reject(err);
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

    var changeGroupStatus = function(id, status){
        var deferred = q.defer();
        if(validator.isNull(id)){
            deferred.reject('Group Id cannot be null');
            return deferred.promise;
        }

        if(validator.isNull(status)){
            deferred.reject('Status cannot be null');
            return deferred.promise;
        }
        getGroupById(id).then(function(group){
            group.status = status;
            group.save(function(err, group){
                if(err){
                    return deferred.reject(err);
                }
                return deferred.resolve(group);
            });
        }, function(err){
            deferred.reject(err);
        });

        return deferred.promise;
    };


    return {
        createGroup: createGroup,
        getGroupByName: getGroupByName,
        getGroupById: getGroupById,
        getAllGroups: getAllGroups,
        changeGroupStatus : changeGroupStatus
    };
};

module.exports = groupController();