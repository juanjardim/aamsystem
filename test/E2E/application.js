'use strict';
process.env.NODE_ENV = 'testing';
var request = require('supertest');
var should = require('should');
var mongoose = require('mongoose');
var User = require('../../models/User');
var AppCtl = require('../../controllers/ApplicationCtl');

describe('Testing Application Routes Actions', function () {
    var url = '/application';
    var createdApp, server;
    before(function (done) {
        delete require.cache[require.resolve('../../server')];
        server = require('../../server');
        done();
    });

    before(function (done) {
        AppCtl.createApplication("Test App", "Test App", "127.0.0.1:3030").then(function (application) {
            createdApp = application;
            done();
        }, function (err) {
            done();
        });
    });

    describe('Authenticate an User that has access to the application', function () {
        var createdUser;
        before(function (done) {
            var newUser = new User({
                username: "dummyUser",
                email: "dummy@test.com",
                authorizedApplications: [createdApp._id],
                password: "1230",
                status: 'ACTIVE',
                roles: ['Admin', 'User']
            });

            newUser.save(function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    createdUser = user;
                }
                done();
            });
        });

        it('Authenticate User in Application', function (done) {
            request(server)
                .post(url + '/authenticate')
                .set('Authorization', createdApp.jwtToken)
                .send({username: "dummyUser", password: '1230'})
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.user);
                    should.exist(res.body.token);
                    var user = res.body.user;
                    user.username.should.equal(createdUser.username);
                    user.status.should.be.eql('ACTIVE');
                    done();
                });
        });

        it('Get all Application Permission for specific user');

        it('Change user password', function(done){
            request(server)
                .post(url + '/changepassword')
                .set('Authorization', createdApp.jwtToken)
                .send({userId: createdUser._id, password: 'A1430abcd'})
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.result);
                    res.body.result.should.be.eql('Password changed');
                    done();
                });
        });
    });

    describe('Fail authentication when the user not has access to application', function(){
        var createdUser;
        before(function (done) {
            var newUser = new User({
                username: "dummyUser2",
                email: "dummy@test.com",
                authorizedApplications: [],
                password: "1230",
                status: 'ACTIVE',
                roles: ['Admin', 'User']
            });

            newUser.save(function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    createdUser = user;
                }
                done();
            });
        });

        it('Fail User Authentication', function (done) {
            request(server)
                .post(url + '/authenticate')
                .set('Authorization', createdApp.jwtToken)
                .send({username: "dummyUser2", password: '1230'})
                .expect(401)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.error);
                    res.body.error.should.be.eql("User don't have authorization for this Application");
                    done();
                });
        });
    });

    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            server.close(done);
        });
    });

});

