'use strict';
process.env.NODE_ENV = 'testing';
var request = require('supertest');
var should = require('should');
var mongoose = require('mongoose');
var User = require('../../models/User');

describe('Testing Admin actions', function () {
    var server, token;
    var url = '/admin';
    before(function (done) {
        delete require.cache[require.resolve('../../server')];
        server = require('../../server');
        done();
    });

    before(function (done) {
        var newUser = new User({
            username: "dummy",
            email: "dummy@test.com",
            fields: [],
            password: "1230",
            status: 'ACTIVE',
            roles: ['Admin', 'User']
        });

        newUser.save(function (err, user) {
            if (err) {
                console.log(err);
            } else {
                request(server)
                    .post('/login')
                    .send({
                        username: 'dummy',
                        password: '1230'
                    })
                    .expect(200)
                    .end(function (err, res) {
                        token = res.body.token;
                        done();
                    });
            }
        });
    });

    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            server.close(done);
        });
    });


    describe('Testing action on users', function () {
        var newUser = {
            username: "myUser",
            email: "myUser@gmail.com",
            fields: []
        };
        var user;

        it('Create a new User', function (done) {
            request(server)
                .post(url + '/user')
                .set('Authorization', token)
                .send(newUser)
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.user);
                    user = res.body.user;
                    user.username.should.equal(newUser.username);
                    user.active.should.be.true();
                    done();
                });
        });

        it('Get all users', function(done){
            request(server)
                .get(url + '/users')
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.users);
                    res.body.users.should.have.length(2);
                    done();
                });
        });

        it('Not allow to create the same user', function (done) {
            request(server)
                .post(url + '/user')
                .set('Authorization', token)
                .send(newUser)
                .expect(500)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.error);
                    res.body.error.should.be.equal('User already Exist');
                    done();
                });
        });

        it('Get a existing user by ID', function (done) {
            request(server)
                .get(url + '/user/' + user._id)
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.user);
                    var reqUser = res.body.user;
                    reqUser._id.should.be.eql(user._id);
                    done();
                });
        });

        it('Reset password', function (done) {
            request(server)
                .post(url + '/user/resetpassword')
                .set('Authorization', token)
                .send(user)
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.msg);
                    var msg = res.body.msg;
                    msg.should.be.equal("Password reset");
                    done();
                });
        });

        it('Not Reset a password for an invalid user', function (done) {
            request(server)
                .post(url + '/user/resetpassword')
                .set('Authorization', token)
                .send(newUser)
                .expect(500)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.error);
                    res.body.error.should.be.equal('User Id cannot be null');
                    done();
                });
        });

        it('Change status to INACTIVE', function (done) {
            var body = {
                user: user,
                status: 'INACTIVE'
            };
            request(server)
                .post(url + '/user/changestatus')
                .set('Authorization', token)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.user);
                    res.body.user.status.should.be.equal('INACTIVE');
                    done();
                });
        });

    });

    describe('Testing actions on groups', function () {
        var newGroup = {
            name: 'New Group',
            description: 'this is a new group'
        };
        var createdGroup;
        it('Create a new Group', function (done) {
            request(server)
                .post(url + '/group')
                .set('Authorization', token)
                .send(newGroup)
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.group);
                    createdGroup = res.body.group;
                    createdGroup.name.should.be.equal(newGroup.name);
                    done();
                });
        });

        it('Not allow to create a group with the same name of an existing group', function (done) {
            request(server)
                .post(url + '/group')
                .set('Authorization', token)
                .send(newGroup)
                .expect(500)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.error);
                    res.body.error.should.be.equal('Group already exist');
                    done();
                });
        });

        it('Get a group by Id', function (done) {
            request(server)
                .get(url + '/group/' + createdGroup._id)
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.group);
                    var requestedGroup = res.body.group;
                    requestedGroup._id.should.be.eql(createdGroup._id);
                    done();
                });
        });

        it('Deactivate a group', function (done) {
            var body = {
                group: createdGroup,
                status: 'INACTIVE'
            };
            request(server)
                .post(url + '/group/changestatus')
                .set('Authorization', token)
                .send(body)
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.group);
                    var requestedGroup = res.body.group;
                    requestedGroup._id.should.be.eql(createdGroup._id);
                    requestedGroup.status.should.be.eql('INACTIVE');
                    done();
                });
        });

        it('Get all Groups', function(done){
            request(server)
                .get(url + '/groups')
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.groups);
                    res.body.groups.should.have.length(1);
                    done();
                });
        });
    });

    describe('Testing action for users and groups', function () {
        var createdGroup, createdUser;
        before(function (done) {
            mongoose.connection.db.dropDatabase(done);
        });

        before(function (done) {
            var newGroup = {
                name: 'New Group',
                description: 'this is a new group'
            };
            request(server)
                .post(url + '/group')
                .set('Authorization', token)
                .send(newGroup)
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.group);
                    createdGroup = res.body.group;
                    createdGroup.name.should.be.equal(newGroup.name);
                    done();
                });
        });

        before(function (done) {
            var newUser = {
                username: "juanjardim",
                email: "juanjardim@gmail.com",
                fields: []
            };
            request(server)
                .post(url + '/user')
                .set('Authorization', token)
                .send(newUser)
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.user);
                    createdUser = res.body.user;
                    createdUser.username.should.equal(newUser.username);
                    createdUser.active.should.be.true();
                    done();
                });
        });

        it('Add a Group to an existing user', function (done) {
            var body = {
                user: createdUser,
                group: createdGroup
            };
            request(server)
                .post(url + '/user/group')
                .set('Authorization', token)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.user);
                    var requestedUser = res.body.user;
                    requestedUser._id.should.be.eql(createdUser._id);
                    requestedUser.groups.should.have.length(1);
                    done();
                });
        });

        it('Get all groups that the user is in', function (done) {
            request(server)
                .get(url + '/user/' + createdUser._id + '/groups')
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.user);
                    var requestedUser = res.body.user;
                    requestedUser._id.should.be.eql(createdUser._id);
                    requestedUser.groups.should.have.length(1);
                    done();
                });
        });

        it('Return an error when adding a nonexistent group', function (done) {
            var body = {
                user: createdUser,
                group: {
                    _id: mongoose.Types.ObjectId()
                }
            };
            request(server)
                .post(url + '/user/group')
                .set('Authorization', token)
                .send(body)
                .expect(404)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.error);
                    res.body.error.should.be.equal('Group not found');
                    done();
                });
        });

        it('Remove a Group', function (done) {
            var body = {
                user: createdUser,
                group: createdGroup
            };
            request(server)
                .delete(url + '/user/group')
                .set('Authorization', token)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.user);
                    var requestedUser = res.body.user;
                    requestedUser._id.should.be.eql(createdUser._id);
                    requestedUser.groups.should.have.length(0);
                    done();
                });
        });

    });

    describe('Testing action for users and permissions', function () {
        var createdPermission, createdUser;
        before(function (done) {
            mongoose.connection.db.dropDatabase(done);
        });

        before(function (done) {
            var newPermission = {
                name: 'New Permission',
                description: 'this is a new permission',
                applicationId: mongoose.Types.ObjectId()
            };
            request(server)
                .post(url + '/permission')
                .set('Authorization', token)
                .send(newPermission)
                .expect(201)
                .end(function (err, res) {
                    createdPermission = res.body.permission;
                    done();
                });
        });

        before(function (done) {
            var newUser = {
                username: "dummy",
                email: "dummy@test.com",
                fields: []
            };
            request(server)
                .post(url + '/user')
                .set('Authorization', token)
                .send(newUser)
                .expect(201)
                .end(function (err, res) {
                    createdUser = res.body.user;
                    done();
                });
        });

        it('Add permission to an existing user', function (done) {
            var body = {
                user: createdUser,
                permission: createdPermission
            };
            request(server)
                .post(url + '/user/permission')
                .set('Authorization', token)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.user);
                    var requestedUser = res.body.user;
                    requestedUser._id.should.be.eql(createdUser._id);
                    requestedUser.permissions.should.have.length(1);
                    done();
                });
        });

        it('Return an error when adding a nonexistent permission', function (done) {
            var body = {
                user: createdUser,
                permission: {
                    _id: mongoose.Types.ObjectId()
                }
            };
            request(server)
                .post(url + '/user/permission')
                .set('Authorization', token)
                .send(body)
                .expect(404)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.error);
                    res.body.error.should.be.equal('Permission not found');
                    done();
                });
        });

        it('Remove a Permission from user', function (done) {
            var body = {
                user: createdUser,
                permission: createdPermission
            };
            request(server)
                .delete(url + '/user/permission')
                .set('Authorization', token)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.user);
                    var requestedUser = res.body.user;
                    requestedUser._id.should.be.eql(createdUser._id);
                    requestedUser.permissions.should.have.length(0);
                    done();
                });
        });

    });

    describe('Testing actions for applications', function () {
        var newApp, createdApp;
        before(function () {
            newApp = {
                name: 'New Application',
                description: 'New App',
                host: 'Local'
            };
        });

        it('Create a new Application', function (done) {
            request(server)
                .post(url + '/application')
                .set('Authorization', token)
                .send(newApp)
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.application);
                    createdApp = res.body.application;
                    createdApp.name.should.be.equal(newApp.name);
                    should.exist(createdApp.jwtSecret);
                    should.exist(createdApp.jwtToken);
                    done();
                });
        });

        it('Get Application by Id', function (done) {
            request(server)
                .get(url + '/application/' + createdApp._id)
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.application);
                    var application = res.body.application;
                    application.name.should.be.equal(newApp.name);
                    should.not.exist(application.jwtSecret);
                    done();
                });
        });

        it('Generate a new JWT Secret', function (done) {
            request(server)
                .post(url + '/application/newJwtSecret')
                .send({application: createdApp})
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.secret);
                    done();
                });
        });

        it('Change status to INACTIVE', function (done) {
            var body = {
                application: createdApp,
                status: 'INACTIVE'
            };
            request(server)
                .post(url + '/application/changestatus')
                .set('Authorization', token)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.application);
                    res.body.application.status.should.be.equal('INACTIVE');
                    done();
                });
        });

        it('Get All Applications', function (done) {
            request(server)
                .get(url + '/applications')
                .expect(200)
                .set('Authorization', token)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.applications);
                    res.body.applications.should.have.length(1);
                    done();
                });
        });

        it('Get all users that has access to specific application', function (done) {
            request(server)
                .get(url + '/application/' + createdApp._id + '/users')
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.users);
                    res.body.users.should.have.length(0);
                    done();
                });
        });

        it('Get all application permission', function(done){
            request(server)
                .get(url + '/application/' + createdApp._id + '/permissions')
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.permissions);
                    res.body.permissions.should.have.length(0);
                    done();
                });
        });
    });

    describe('Testing action for users and applications', function () {
        var createdApp, createdUser;
        before(function (done) {
            mongoose.connection.db.dropDatabase(done);
        });

        before(function (done) {
            var newApplication = {
                name: 'New Application',
                description: 'this is a new application',
                host: '127.0.0.1:3030'
            };
            request(server)
                .post(url + '/application')
                .set('Authorization', token)
                .send(newApplication)
                .expect(201)
                .end(function (err, res) {
                    createdApp = res.body.application;
                    done();
                });
        });

        before(function (done) {
            var newUser = {
                username: "userAppDummy",
                email: "userAppDummy@test.com",
                fields: []
            };
            request(server)
                .post(url + '/user')
                .set('Authorization', token)
                .send(newUser)
                .expect(201)
                .end(function (err, res) {
                    createdUser = res.body.user;
                    done();
                });
        });

        it('Add application to user', function (done) {
            var body = {
                user: createdUser,
                application: createdApp
            };
            request(server)
                .post(url + '/user/application')
                .set('Authorization', token)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.user);
                    var requestedUser = res.body.user;
                    requestedUser._id.should.be.eql(createdUser._id);
                    requestedUser.authorizedApplications.should.have.length(1);
                    done();
                });
        });

        it('Get all users that has access to specific application', function (done) {
            request(server)
                .get(url + '/application/' + createdApp._id + '/users')
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.users);
                    res.body.users.should.have.length(1);
                    done();
                });
        });

        it('Remove application to user', function (done) {
            var body = {
                user: createdUser,
                application: createdApp
            };
            request(server)
                .delete(url + '/user/application')
                .set('Authorization', token)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.user);
                    res.body.user.authorizedApplications.should.have.length(0);
                    done();
                });
        });
    });

});