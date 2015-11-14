'use strict';
process.env.NODE_ENV = 'testing';
var request = require('supertest');
var should = require('should');
var mongoose = require('mongoose');

describe('Testing System Actions', function () {
    var server;
    var url = '/system';
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

    it('should get false when the system is not configured', function (done) {
        request(server)
            .get(url + '/isSystemConfigured')
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                should.exist(res.body.result);
                res.body.result.should.eql(false);
                done();
            });
    });

    it('should configure the system', function (done) {
        var newUser = {
            username: "admim",
            email: "admin@gmail.com",
            fields: []
        };
        var user;
        request(server)
            .post(url + '/configure')
            .send(newUser)
            .expect(201)
            .end(function (err, res) {
                should.not.exist(err);
                should.exist(res.body.user);
                should.exist(res.body.result);
                user = res.body.user;
                user.username.should.equal(newUser.username);
                user.active.should.be.true();
                done();
            });
    });

    it('should get true when the system is configured', function (done) {
        request(server)
            .get(url + '/isSystemConfigured')
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                should.exist(res.body.result);
                res.body.result.should.eql(true);
                done();
            });
    });
});