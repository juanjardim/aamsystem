'use strict';
process.env.NODE_ENV = 'testing';
var should = require('should');
var mongoose = require('mongoose');
var config = require('../../configs/config');
require('../../configs/mongoose')(config);
var userCtl = require('../../controllers/UserCtl')();

describe('Testing User Controller', function () {
    before(function (done) {
        if (mongoose.connection.db)
            return done();
        mongoose.connect(config.mongoURI, done);
    });


    var username = "juanito";
    it('Should return false when check if a user is exists', function (done) {
        userCtl.userExist(username).then(function (hasUser) {
            hasUser.should.be.false();
            done();
        });
    });

    it('Should Create a user when passing the username, email and password', function (done) {
        userCtl.createUser(username, "email", "password", "fields").then(function (user) {
            user.username.should.be.equal(username);
            user.active.should.be.true();
            //should(user).not.have.property(password);
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
