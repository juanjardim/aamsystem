'use strict';
process.env.NODE_ENV = 'testing';
var request = require('supertest');
var should = require('should');

describe('testing authentication actions', function(){
    var server;
    before(function(done){
        delete require.cache[require.resolve('../server')];
        server = require('../server');
        done();
    });

    after(function(done){
        server.close(done);
    });

    var wrongUser = {
        username: 'notCreated',
        password: '12sd53'
    };

    it('should return an 401 when failed authentication', function(done){
        request(server)
            .post('/login')
            .send(wrongUser)
            .expect(401, done);
    });
});