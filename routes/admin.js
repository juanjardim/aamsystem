'use strict';
var express = require('express');
var router = express.Router();
var UserCtl = require('../controllers/UserCtl');
var GroupCtl = require('../controllers/GroupCtl');

module.exports = function (app) {

    router.post('/user', function (req, res) {
        var user = req.body;
        UserCtl.createUser(user.username, user.email, user.fields).then(function (user) {
            res.status(200).json({user: user});
        }, function (err) {
            res.status(500).json({error: err});
        });
    });

    router.get('/user/:id', function (req, res) {
        var userId = req.params.id;
        UserCtl.getUserById(userId).then(function (user) {
            if(user == null){
                return res.status(404).json({error: 'User not found'});
            }
            res.status(200).json({user: user});
        }, function (err) {
            res.status(500).json({error: err});
        })
    });

    router.post('/user/resetpassword', function (req, res) {
        var user = req.body;
        UserCtl.resetPassword(user._id).then(function (msg) {
            res.status(200).json({msg: msg});
        }, function (err) {
            res.status(500).json({error: err});
        });
    });

    router.post('/user/changestatus', function (req, res) {
        var user = req.body.user;
        var status = req.body.status;
        UserCtl.changeUserStatus(user._id, status).then(function (user) {
            res.status(200).json({user: user});
        }, function (err) {
            res.status(500).json({error: err});
        });
    });

    router.post('/user/group', function(req, res){
        var user = req.body.user;
        var group = req.body.group;
        GroupCtl.getGroupById(group._id).then(function(group){
            if(group == null){
                return res.status(404).json({error: 'Group not found'});
            }
            UserCtl.addGroupToUser(user._id, group).then(function(user){
                res.status(200).json({user: user});
            }, function(err){
                res.status(500).json({error: err});
            });
        }, function (err) {
            res.status(500).json({error: err});
        });
    });

    router.delete('/user/group', function(req, res){
        var user = req.body.user;
        var group = req.body.group;
        GroupCtl.getGroupById(group._id).then(function(group){
            if(group == null){
                return res.status(404).json({error: 'Group not found'});
            }
            UserCtl.removeGroupToUser(user._id, group).then(function(user){
                res.status(200).json({user: user});
            }, function(err){
                res.status(500).json({error: err});
            });
        }, function (err) {
            res.status(500).json({error: err});
        });
    });

    router.post('/group', function(req, res){
        var group = req.body;
        GroupCtl.createGroup(group.name, group.description).then(function(group){
            res.status(200).json({group: group});
        }, function(err){
            res.status(500).json({error: err});
        });
    });

    router.get('/group/:id', function(req, res){
        var groupId = req.params.id;
        GroupCtl.getGroupById(groupId).then(function(group){
            if(group == null){
                return res.status(404).json({error: 'Group not found'});
            }
            res.status(200).json({group: group});
        }, function(err){
            res.status(500).json({error: err});
        });
    });

    router.post('/group/changestatus', function(req, res){
        var group = req.body.group;
        var status = req.body.status;
        GroupCtl.changeGroupStatus(group._id, status).then(function(group){
            res.status(200).json({group: group});
        }, function(err){
            res.status(500).json({error: err});
        });
    });

    app.use('/admin', router);
};