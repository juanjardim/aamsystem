'use strict';
process.env.NODE_ENV = 'testing';
var request = require('supertest');
var should = require('should');
var app = require('../server');

describe('Testing routes', function(){
    it('should return a welcome message at the index', function(done){
        request(app)
            .get('/')
            .expect(200)
            .end(function(err, res){
                should.not.exist(err);
                console.log(res.text);
                res.text.should.be.equal('Welcome to AAMSystem API. To continue, you have to be authenticated');
                done();
            });
    });
});