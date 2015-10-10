'use strict';
var express = require('express');
var router = express.Router();
var UserCtl = require('../controllers/UserCtl')();

module.exports = function(app){
    router.get('/users', function(req, res){
        UserCtl.getAllUsers().then(function(users){
            res.status(200).json({users: users});
        }, function(err){
            res.status(500).json({error: err});
        });
    });

    router.post('/user/create', function(req, res){
        var body = req.body;
        UserCtl.createUser(body.username, body.email, body.fields).then(function(user){
            res.status(200).json({user: user});
        }, function(err){
            console.log(err);
            res.status(500).json({error: err});
        });
    });

    app.use('/admin', router);
};