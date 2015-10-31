var jwtService = require('../../services/jwt');
var jwt = require('jwt-simple');
var should = require('should');
var config = require('../../configs/config');
var mongoose = require('mongoose');

describe('Testing JWT service', function(){
    describe('Generate JWT for user', function(){
       var user, token;
        before(function(){
            var ObjectId = mongoose.Types.ObjectId();
            user = {
                _id : ObjectId
            };
        });

        it('Generate a valid JWT when passing an user', function(){
            token = jwtService.generateToken(user);
            var decoded = jwt.decode(token, config.jwtTokenSecret, true, config.jwtAlgorithm);
            decoded.sub.should.be.eql(user._id.toString());
        });

        it('Validate JWT', function(){
            var request = jwtService.validateToken(token);
            request.errorId.should.be.eql(0);
        });

    });


    describe('Generate JWT for application', function(){
        it('Return a valid JWT for an application');
    });


});