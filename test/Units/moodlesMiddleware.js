var should = require('should');
var mongoose = require('mongoose');

var AppCtl = require('../../controllers/ApplicationCtl');
var GroupCtl = require('../../controllers/GroupCtl');
var PermissionCtl = require('../../controllers/PermissionCtl');
var UserCtl = require('../../controllers/UserCtl');
var ModelMiddleware = require('../../services/modelsMiddleware');


describe('Model Middleware services', function () {
    var createdUser, createdApp, createdGroup, createdPermission;
    before(function (done) {
        if (mongoose.connection.db)
            return done();
        mongoose.connect(config.mongoURI, done);
    });

    before(function (done) {
        AppCtl.createApplication('NewApplication', 'This is a new Application', '127.0.0.0:3030').then(function (application) {
            createdApp = application;
            done();
        });
    });

    before(function (done) {
        PermissionCtl.createPermission('NewPermission', 'New Permission', createdApp).then(function (permission) {
            createdPermission = permission;
            done();
        });
    });

    before(function (done) {
        GroupCtl.createGroup('NewGroup', 'New Group').then(function (group) {
            createdGroup = group;
            GroupCtl.addPermissionToGroup(createdGroup._id, createdPermission).then(function (group) {
                done();
            });
        });
    });

    before(function (done) {
        UserCtl.createUser('dummy', 'dummy@test.com', []).then(function (user) {
            createdUser = user;
            UserCtl.addGroupToUser(createdUser._id, createdGroup).then(function (user) {
                UserCtl.addPermissionToUser(createdUser._id, createdPermission).then(function (user) {
                    UserCtl.addApplicationToUser(createdUser._id, createdApp).then(function (user) {
                        done();
                    });
                });
            });
        });
    });

    it('Get All the user information', function (done) {
        ModelMiddleware.getAllUserInfo(createdUser._id).then(function (user) {
            should.exist(user);
            user.groups.should.have.length(1);
            user.permissions.should.have.length(1);
            user.authorizedApplications.should.have.length(1);
            done();
        }, function (err) {
            console.log(err);
            done();
        });
    });

    it('Get ALl the user Information filter by application', function(done){
        ModelMiddleware.getAllUserInfo(createdUser._id).then(function (user) {
            should.exist(user);
            user.groups.should.have.length(1);
            user.permissions.should.have.length(1);
            user.authorizedApplications.should.have.length(1);
            done();
        }, function (err) {
            console.log(err);
            done();
        });
    });

    after(function (done) {
        mongoose.connection.db.dropDatabase(done);
    });
});