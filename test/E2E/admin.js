'use strict';
process.env.NODE_ENV = 'testing';
var request = require('supertest');
var should = require('should');
var mongoose = require('mongoose');

describe('Testing Admin actions', function () {
    var server;
    var url = '/admin';
    before(function (done) {
        delete require.cache[require.resolve('../../server')];
        server = require('../../server');
        done();
    });

    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            server.close(done);
        });
    });
    describe('Testing action on users', function () {
        var newUser = {
            username: "juanjardim",
            email: "juanjardim@gmail.com",
            fields: []
        };
        var user;

        it('Create a new User', function (done) {
            request(server)
                .post(url + '/user')
                .send(newUser)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.user);
                    user = res.body.user;
                    user.username.should.equal(newUser.username);
                    user.active.should.be.true();
                    done();
                });
        });

        it('Not allow to create the same user', function (done) {
            request(server)
                .post(url + '/user')
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
                .send(user)
                .expect(200)
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
                .send(newGroup)
                .expect(200)
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
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.group);
                    var requestedGroup = res.body.group;
                    requestedGroup._id.should.be.eql(createdGroup._id);
                    requestedGroup.status.should.be.eql('INACTIVE');
                    done();
                });
        });
    });

    describe('Testing action for users and groups', function () {
        var createdGroup, createdUser;
        before(function (done) {
            mongoose.connection.db.dropDatabase(done);
        });

        before(function(done){
            var newGroup = {
                name: 'New Group',
                description: 'this is a new group'
            };
            request(server)
                .post(url + '/group')
                .send(newGroup)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.group);
                    createdGroup = res.body.group;
                    createdGroup.name.should.be.equal(newGroup.name);
                    done();
                });
        });

        before(function(done){
            var newUser = {
                username: "juanjardim",
                email: "juanjardim@gmail.com",
                fields: []
            };
            request(server)
                .post(url + '/user')
                .send(newUser)
                .expect(200)
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
        it('Return an error when adding a nonexistent group', function(done){
            var body = {
                user: createdUser,
                group: {
                    _id: mongoose.Types.ObjectId()
                }
            };
            request(server)
                .post(url + '/user/group')
                .send(body)
                .expect(404)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.error);
                    res.body.error.should.be.equal('Group not found');
                    done();
                });
        });
        it('Remove a Group', function(done){
            var body = {
                user: createdUser,
                group: createdGroup
            };
            request(server)
                .delete(url + '/user/group')
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

});