'use strict';
process.env.NODE_ENV = 'testing';
var request = require('supertest');
var should = require('should');
var mongoose = require('mongoose');
var User = require('../../models/User');

describe('testing authentication actions', function(){
    var server;
    before(function(done){
        delete require.cache[require.resolve('../../server')];
        server = require('../../server');
        done();
    });

    after(function(done){
        mongoose.connection.db.dropDatabase(function () {
            server.close(done);
        });
    });

    var wrongUser = {
        username: 'notCreated',
        password: '12sd53'
    };

    before(function(done){
        var newUser = new User({
            username: "dummy",
            email: "dummy@test.com",
            fields: [],
            password: "1230",
            status: 'ACTIVE',
            roles : ['Admin', 'User']
        });
        newUser.save(function (err, user) {
            if (err) {
                console.log(err);
            }
            done();
        });
    });

    it('should return an 401 when failed authentication', function(done){
        request(server)
            .post('/login')
            .send(wrongUser)
            .expect(401, done);
    });

    it('Authenticate an user', function(done){
        request(server)
            .post('/login')
            .send({
                username: 'dummy',
                password: '1230'})
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                should.exist(res.body.token);
                done();
            });
    });
});