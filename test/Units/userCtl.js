'use strict';
process.env.NODE_ENV = 'testing';
var should = require('should');
var mongoose = require('mongoose');
var config = require('../../configs/config');
require('../../configs/mongoose')(config);
var UserCtl = require('../../controllers/UserCtl');

describe('Testing User Controller', function () {
    before(function (done) {
        if (mongoose.connection.db)
            return done();
        mongoose.connect(config.mongoURI, done);
    });
    var username = "juanito";
    var email = "juanjardim@gmail.com";
    var fields = [];
    var createdUser;

    describe('User Creation', function(){
        it('Create an user when passing the username and email', function (done) {
            UserCtl.createUser(username, email, fields).then(function (user) {
                user.username.should.be.equal(username);
                user.active.should.be.true();
                done();
            }, function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('Not Create a user when missing username', function (done) {
            UserCtl.createUser(null).then(function (user) {
                should.not.exist(user);
                done();
            }, function (err) {
                should.exist(err);
                err.should.be.equal('Username is needed');
                done();
            });
        });

        it('Not Create a user when the email is invalid', function (done) {
            UserCtl.createUser(username, "123", fields).then(function (user) {
                should.not.exist(user);
                done();
            }, function (err) {
                should.exist(err);
                err.should.be.equal('Invalid e-mail');
                done();
            });
        });

    });

    describe('Get information of user', function(){
        it('Should get a null value when getting a user that doesn\'t exist', function (done) {
            UserCtl.getUserByUsername('xpto').then(function (user) {
                should.not.exist(user);
                done();
            }, function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('Get an existing user', function (done) {
            UserCtl.getUserByUsername(username).then(function (user) {
                should.exist(user);
                user.username.should.be.equal(username);
                createdUser = user;
                done();
            }, function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('Get an existing user by ID', function (done) {
            UserCtl.getUserById(createdUser._id).then(function (user) {
                should.exist(user);
                user.username.should.be.equal(username);
                done();
            }, function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('Get all existing users', function (done) {
            UserCtl.getAllUsers().then(function (users) {
                users.should.have.length(1);
                done();
            }, function (err) {
                should.not.exist(err);
                done();
            });
        });
    });

    describe('Change Status', function(){
        it('Change Status to INACTIVE', function (done) {
            UserCtl.changeUserStatus(createdUser._id, 'INACTIVE').then(function (user) {
                should.exist(user);
                user.status.should.be.equal('INACTIVE');
                done();
            }, function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('Change Status to ACTIVE', function(done){
            UserCtl.changeUserStatus(createdUser._id, 'ACTIVE').then(function(user){
                should.exist(user);
                user.status.should.be.equal('ACTIVE');
                done();
            }, function(err){
                should.not.exist(err);
                done();
            });
        });
    });

    describe('Actions for password', function(){
        it('Change password', function (done) {
            UserCtl.changePassword(createdUser._id, 'HelloW1rld').then(function (msg) {
                should.exist(msg);
                msg.should.be.equal('Password changed');
                done();
            }, function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('Cannot change password when is invalid', function (done) {
            UserCtl.changePassword(createdUser._id, '123').then(function (msg) {
                should.not.exist(msg);
                done();
            }, function (err) {
                should.exist(err);
                err.should.be.equal('Invalid Password, should have at least 4 characters and start with an letter');
                done();
            });
        });

        it('Reset password', function(done){
            UserCtl.resetPassword(createdUser._id).then(function(msg){
                should.exist(msg);
                msg.should.be.eql("Password reset");
                done();
            }, function(err){
                should.not.exist(err);
                done();
            });
        });
    });


    describe('Action for Groups', function(){
        var group;
        before(function(){
            var ObjectId = mongoose.Types.ObjectId();
            group = {
                _id: ObjectId,
                name: 'Test Group'
            };
        });
        it('Add a new Group', function(done){
            UserCtl.addGroupToUser(createdUser._id, group).then(function(user){
                should.exist(user);
                user.groups.should.have.length(1);
                done();
            }, function(err){
                should.not.exist(err);
                done();
            });
        });
        it('Cannot add a null Group to an User', function(done){
            UserCtl.addGroupToUser(createdUser._id, null).then(function(user){
                should.not.exist(user);
                done();
            }, function(err){
                should.exist(err);
                err.should.be.equal('Group cannot be null');
                done();
            });
        });

        it('Remove an existing Group', function(done){
            UserCtl.removeGroupToUser(createdUser._id, group).then(function(user){
                should.exist(user);
                user.groups.should.have.length(0);
                done();
            }, function(err){
                should.not.exist(err);
                done();
            });
        });
        it('Cannot remove a null Group to an User', function(done){
            UserCtl.addGroupToUser(createdUser._id, null).then(function(user){
                should.not.exist(user);
                done();
            }, function(err){
                should.exist(err);
                err.should.be.equal('Group cannot be null');
                done();
            });
        });
    });

    describe('Operation for single Permission', function(){
        it('Add single Permission');
        it('Remove an existing Permission')
    });

    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(done);
        });
    });
});
