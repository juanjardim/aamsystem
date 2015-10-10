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
        it('Should return an empty array of users', function (done) {
            request(server)
                .get(url + '/users')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.body.users.should.have.length(0);
                    done();
                });
        });

        var newUser = {
            username: "juanjardim",
            email: "juanjardim@gmail.com",
            fields: []
        };
        var user;

        it('Should create a new User', function (done) {
            request(server)
                .post(url + '/user/create')
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

        it('Should not allow to create the same user', function (done) {
            request(server)
                .post(url + '/user/create')
                .send(newUser)
                .expect(500)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.error);
                    res.body.error.should.be.equal('User already Exist');
                    done();
                });
        });
    });


});