'use strict';
var q = require('q');
var _ = require('underscore');
var AAMSystem = require('../models/AAMSystem');

var AAMSystemCtl = function () {

    var configure = function () {
        var deferred = q.defer();
        var promise = deferred.promise;
        AAMSystem.findOne(function (err, aamsystem) {
            if (aamsystem) {
                return deferred.reject('System already configured');
            }
            var newSystem = new AAMSystem();
            newSystem.save(function (err, system) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve('System configured');
            });
        });
        return promise;
    };

    var editFields = function (fields) {
        var deferred = q.defer();
        var promise = deferred.promise;

        AAMSystem.findOne(function (err, system) {
            if (err) {
                return deferred.reject(err);
            }
            if (!system)
                return deferred.reject('System not Configured');
            system.fields = fields;
            system.save(function (err, system) {
                if (err) {
                    return deferred.reject(err);
                }
                return deferred.resolve(system.fields);
            });
        });

        return promise;
    };

    var getFields = function () {
        var deferred = q.defer();
        var promise = deferred.promise;
        AAMSystem.findOne(function (err, system) {
            if (err) {
                return deferred.reject(err);
            }
            if (system)
                return deferred.resolve(system.fields);
            else
                return deferred.reject('System not Configured');
        });
        return promise;
    };

    var isSystemConfigured = function () {
        var deferred = q.defer();
        var promise = deferred.promise;
        AAMSystem.findOne(function (err, system) {
            if (err) {
                return deferred.reject(err);
            }
            if (system)
                return deferred.resolve(true);
            else
                return deferred.resolve(false);
        });
        return promise;
    };

    return {
        configure: configure,
        editFields: editFields,
        getFields: getFields,
        isSystemConfigured : isSystemConfigured
    };
};

module.exports = AAMSystemCtl();