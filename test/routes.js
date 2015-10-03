'use strict';
process.env.NODE_ENV = 'testing';
var request = require('supertest');
var should = require('should');
//var server = require('../server');

describe('Testing routes', function(){
    var server;
    before(function(done){
        delete require.cache[require.resolve('../server')];
        server = require('../server');
        done();
    });

    after(function(done){
        server.close(done);
        console.log("connection close");
    });

    it('should return a welcome message at the index', function(done){
        request(server)
            .get('/')
            .expect(200)
            .end(function(err, res){
                should.not.exist(err);
                res.text.should.be.equal('Welcome to AAMSystem API. To continue, you have to be authenticated');
                done();
            });
    });

    it('should return 404 on not defined routes', function(done){
        request(server)
            .get('/sometime/wrong')
            .expect(404, done);
    });

});