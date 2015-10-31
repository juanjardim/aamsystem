'use strict';
var q = require('q');
var validator = require('validator');
var Application = require('../models/Application');
var jwt = require('../services/jwt');
var crypto = require('crypto');

var applicationCtl = function () {

    var createApplication = function (name, description, host) {
        var deferred = q.defer();
        var promise = deferred.promise;

        getApplicationByName(name).then(function (application) {
            if (!validator.isNull(application)) {
                return deferred.reject('Application already exist');
            }
            var tokenSecret = crypto.randomBytes(7).toString('hex');
            var newApplication = new Application({
                name: name,
                description: description,
                host: host,
                jwtSecret: tokenSecret
            });

            newApplication.save(function (err, application) {
                if (err) {
                    deferred.reject(err);
                }
                application = application.toJSON();
                application.jwtSecret = tokenSecret;
                application.jwtToken = jwt.generateAppToken(application);

                deferred.resolve(application);
            });

        }, function (err) {
            return deferred(err);
        });

        return promise;
    };

    var getApplicationByName = function (name) {
        var deferred = q.defer();
        var promise = deferred.promise;
        if (validator.isNull(name)) {
            deferred.reject('Application name cannot be null');
            return promise;
        }

        Application.findOne({name: name}, function (err, application) {
            if (err) {
                return deferred.reject(err);
            }
            if (application != undefined)
                deferred.resolve(application.toJSON());
            else
                deferred.resolve(application);
        });
        return promise;
    };

    var getApplicationById = function (id) {
        var deferred = q.defer();
        var promise = deferred.promise;
        if (validator.isNull(id)) {
            deferred.reject('Application ID cannot be null');
            return promise;
        }

        Application.findOne(id, {jwtSecret: -1}, function (err, application) {
            if (err) {
                return deferred.reject(err);
            }
            if (validator.isNull(application)) {
                return deferred.reject('Application not found');
            }
            deferred.resolve(application);
        });
        return promise;
    };

    var getAllApplication = function () {
        var deferred = q.defer();
        var promise = deferred.promise;

        Application.find(function (err, applications) {
            if (err) {
                return deferred.reject(err);
            }
            deferred.resolve(applications);
        });

        return promise;
    };

    var changeApplicationStatus = function (id, status) {
        var deferred = q.defer();
        var promise = deferred.promise;
        if (validator.isNull(id)) {
            deferred.reject('Application Id cannot be null');
            return promise;
        }
        if (validator.isNull(status)) {
            deferred.reject('Status cannot be null');
            return promise;
        }

        getApplicationById(id).then(function (application) {
            application.status = status;
            application.save(function (err, application) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(application.toJSON());
            })
        }, function (err) {
            deferred.reject(err);
        });

        return promise;
    };

    var getJWTSecret = function (id) {
        var deferred = q.defer();
        var promise = deferred.promise;
        if(validator.isNull(id)){
            deferred.reject('Application Id cannot be null');
            return promise;
        }
        Application.findOne(id, function (err, application) {
            if (err) {
                return deferred.reject(err);
            }
            if (validator.isNull(application)) {
                return deferred.reject('Application not found');
            }
            deferred.resolve(application.jwtSecret);
        });

        return promise;
    };

    var generateNewJWTSecret = function (id) {
        var deferred = q.defer();
        var promise = deferred.promise;
        if (validator.isNull(id)) {
            deferred.reject('Application Id cannot be null');
            return promise;
        }

        getApplicationById(id).then(function (application) {
            application.jwtSecret = crypto.randomBytes(7).toString('hex');
            application.save(function (err, application) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(application.jwtSecret);
            });
        });

        return promise;

    };

    return {
        createApplication: createApplication,
        getApplicationByName: getApplicationByName,
        getApplicationById: getApplicationById,
        getAllApplication: getAllApplication,
        changeApplicationStatus: changeApplicationStatus,
        generateNewJWTSecret: generateNewJWTSecret,
        getJWTSecret: getJWTSecret
    };
};

module.exports = applicationCtl();