'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var ApplicationCtl = require('../controllers/ApplicationCtl');
//var userCtl = require('../controllers/UserCrl');
//var GroupCtl = require('../controllers/GroupCtl');
//var PermissionCtl = require('../controllers/PermissionCtl');
var jwt = require('../services/jwt');

module.exports = function (app) {
    router.use(function (req, res, next) {
        if (!req.headers.authorization) {
            return res.status(401).json({error: 'Application not Authorized'});
        }
        var token = req.headers.authorization;
        if (token) {
            var result = jwt.validateAppToken(token);
            if (result.errorId) {
                return res.status(401).json({error: result.errorText});
            }
            var host = req.get('host');
            if (host != result.payload.host) {
                return res.status(401).json({error: 'Invalid Host'});
            }
            req.applicationId = result.payload.sub;
            next();
        } else {
            return res.status(403).json({
                error: 'No token provided'
            });
        }
    });

    router.post('/authenticate', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).send(info);
            }
            if(user.authorizedApplications.indexOf(req.applicationId) < 0){
                return res.status(401).json({
                    error: "User don't have authorization for this Application"
                });
            }

            ApplicationCtl.getJWTSecret(req.applicationId).then(function(secret){
                res.status(200).json({
                    user: user,
                    token: jwt.generateToken(user, secret)
                });
            }, function(err){
                res.status(500).json({error: err})
            });

        })(req, res, next);
    });

    app.use('/application', router);
};