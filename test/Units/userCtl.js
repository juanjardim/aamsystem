'use strict';
process.env.NODE_ENV = 'testing';
var should = require('should');
var mongoose = require('mongoose');
var config = require('../../configs/config');
require('../../configs/mongoose')(config);
var UserCtl = require('../../controllers/UserCtl')();

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

    it('Should get a null value when getting a user that doesn\'t exist', function (done) {
        UserCtl.getUserByUsername(username).then(function (user) {
            should.not.exist(user);
            done();
        });
    });

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

    it('Get all existing users', function (done) {
        UserCtl.getAllUsers().then(function (users) {
            users.should.have.length(1);
            done();
        }, function (err) {
            console.error(err);
            done();
        });
    });

    it('Deactivate an user', function (done) {
        UserCtl.deactivateUser(createdUser._id).then(function (user) {
            should.exist(user);
            user.status.should.be.equal('INACTIVE');
            done();
        }, function (err) {
            should.not.exist(err);
            done();
        });
    });

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

    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(function () {
                done();
            });
        });
    });
});
