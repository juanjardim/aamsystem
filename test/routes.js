'use strict';
process.env.NODE_ENV = 'testing';
var request = require('supertest');
var should = require('should');
var server = require('../server');

describe('Testing routes', function(){

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


    it('should return 404 on routes don\'t defined', function(done){
        request(server)
            .get('/sometime/wrong')
            .expect(404, done);
    });
});