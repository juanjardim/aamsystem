'use strict';
var express = require('express');
var router = express.Router();
var UserCtl = require('../controllers/UserCtl');
var GroupCtl = require('../controllers/GroupCtl');
var PermissionCtl = require('../controllers/PermissionCtl');
var ApplicationCtl = require('../controllers/ApplicationCtl');
var jwt = require('../services/jwt');

module.exports = function (app) {

    router.use(function (req, res, next) {
        if (!req.headers.authorization) {
            return res.status(401).json({error: 'You are not authorized'});
        }
        var token = req.headers.authorization;
        if (token) {
            var result = jwt.validateToken(token);
            if (result.errorId) {
                return res.status(401).json({error: result.errorText});
            }

            if(result.payload.roles.indexOf('Admin') === -1){
                return res.status(401).json({error: 'You are not authorized'});
            }

            next();
        } else {
            return res.status(403).json({
                error: 'No token provided'
            });
        }
    });

    router.post('/user', function (req, res) {
        var user = req.body;
        UserCtl.createUser(user.username, user.email, user.fields).then(function (user) {
            res.status(201).json({user: user});
        }, function (err) {
            res.status(500).json({error: err});
        });
    });

    router.get('/user/:id', function (req, res) {
        var userId = req.params.id;
        UserCtl.getUserById(userId).then(function (user) {
            if (user == null) {
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
            res.status(201).json({msg: msg});
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

    router.post('/user/group', function (req, res) {
        var user = req.body.user;
        var group = req.body.group;
        GroupCtl.getGroupById(group._id).then(function (group) {
            UserCtl.addGroupToUser(user._id, group).then(function (user) {
                GroupCtl.getUserGroups(req, res, user);
            }, function (err) {
                res.status(500).json({error: err});
            });
        }, function (err) {
            res.status(404).json({error: err});
        });
    });

    router.delete('/user/group', function (req, res) {
        var user = req.body.user;
        var group = req.body.group;
        GroupCtl.getGroupById(group._id).then(function (group) {
            UserCtl.removeGroupToUser(user._id, group).then(function (user) {
                GroupCtl.getUserGroups(req, res, user);
            }, function (err) {
                res.status(500).json({error: err});
            });
        }, function (err) {
            res.status(500).json({error: err});
        });
    });

    router.get('/user/:id/groups', function (req, res) {
        var userId = req.params.id;
        UserCtl.getUserById(userId).then(function (user) {
            GroupCtl.getUserGroups(req, res, user);
        }, function (err) {
            console.log(err);
            res.status(500).json({error: err});
        })
    });

    router.get('/user/:id/permissions', function (req, res) {
        var userId = req.params.id;
        UserCtl.getUserById(userId).then(function (user) {
            PermissionCtl.getUserPermissions(req, res, user);
        }, function (err) {
            res.status(500).json({error: err});
        });
    });

    router.post('/user/permission', function (req, res) {
        var user = req.body.user;
        var permission = req.body.permission;
        PermissionCtl.getPermissionById(permission._id).then(function (permission) {
            if (permission == null) {
                return res.status(404).json({error: 'Permission not found'});
            }
            UserCtl.addPermissionToUser(user._id, permission).then(function (user) {
                PermissionCtl.getUserPermissions(req, res, user);
            }, function (err) {
                res.status(500).json({error: err});
            });
        }, function (err) {
            res.status(500).json({error: err});
        });
    });

    router.delete('/user/permission', function (req, res) {
        var user = req.body.user;
        var permission = req.body.permission;
        PermissionCtl.getPermissionById(permission._id).then(function (permission) {
            if (permission == null) {
                return res.status(404).json({error: 'Permission not found'});
            }
            UserCtl.removePermissionToUser(user._id, permission).then(function (user) {
                PermissionCtl.getUserPermissions(req, res, user);
            }, function (err) {
                res.status(500).json({error: err});
            });
        }, function (err) {
            res.status(500).json({error: err});
        });
    });

    router.post('/group', function (req, res) {
        var group = req.body;
        GroupCtl.createGroup(group.name, group.description).then(function (group) {
            res.status(201).json({group: group});
        }, function (err) {
            res.status(500).json({error: err});
        });
    });

    router.get('/group/:id', function (req, res) {
        var groupId = req.params.id;
        GroupCtl.getGroupById(groupId).then(function (group) {
            res.status(200).json({group: group});
        }, function (err) {
            res.status(404).json({error: err});
        });
    });

    router.post('/group/changestatus', function (req, res) {
        var group = req.body.group;
        var status = req.body.status;
        GroupCtl.changeGroupStatus(group._id, status).then(function (group) {
            res.status(201).json({group: group});
        }, function (err) {
            res.status(500).json({error: err});
        });
    });

    router.post('/permission', function (req, res) {
        var permission = req.body;
        PermissionCtl.createPermission(permission.name, permission.description, permission.applicationId).then(function (permission) {
            res.status(201).json({permission: permission});
        }, function (err) {
            res.status(500).json({error: err});
        });
    });

    router.post('/application', function (req, res) {
        var application = req.body;
        ApplicationCtl.createApplication(application.name, application.description, application.host).then(function (application) {
            res.status(201).json({application: application});
        }, function (err) {
            res.status(500).json({error: err});
        });
    });


    app.use('/admin', router);
};