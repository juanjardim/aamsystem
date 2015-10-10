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

    it('Should get a null value when getting a user that doesn\'t exist', function (done) {
        UserCtl.getUser(username).then(function (user) {
            should.not.exist(user);
            done();
        });
    });

    it('Should Create an user when passing the username and email', function (done) {
        UserCtl.createUser(username, email, fields).then(function (user) {
            user.username.should.be.equal(username);
            user.active.should.be.true();
            done();
        }, function (err) {
            console.error(err);
            done();
        });
    });

    it('Should get an existing user', function (done) {
        UserCtl.getUser(username).then(function (user) {
            should.exist(user);
            user.username.should.be.equal(username);
            done();
        }, function (err) {
            console.error(err);
            done();
        });
    });

    it('Should get all existing users', function (done) {
        UserCtl.getAllUsers().then(function (users) {
            users.should.have.length(1);
            done();
        }, function (err) {
            console.error(err);
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
