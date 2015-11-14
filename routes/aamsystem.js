'use strict';
var express = require('express');
var _ = require('underscore');
var router = express.Router();
var AAMSystemCtl = require('../controllers/AAMSystemCtl');
var UserCtl = require('../controllers/UserCtl');

module.exports = function (app) {
    router.post('/configure', function (req, res) {
        var username = req.body.username;
        var email = req.body.email;
        var fields = req.body.fields;
        if (_.isNull(username) || _.isNull(email)) {
            return res.status(500).json({error: 'Invalid Parameters'});
        }
        AAMSystemCtl.configure().then(function (msg) {
            UserCtl.createUser(username, email, fields, ['Admin', 'User']).then(function (user) {
                return res.status(201).json({result: msg, user: user});
            }, function (err) {
                return res.status(500).json({error: err});
            });
        }, function (err) {
            console.log(err);
            res.status(500).json({error: err});
        });
    });

    router.get('/isSystemConfigured', function (req, res) {
        AAMSystemCtl.isSystemConfigured().then(function (isConfigured) {
            res.status(200).json({result: isConfigured});
        }, function (err) {
            res.status(500).json({error: err});
        });
    });

    app.use('/system', router);
};