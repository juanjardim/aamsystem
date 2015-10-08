var jwtService = require('../../services/jwt');
var jwt = require('jwt-simple');
var should = require('should');
var config = require('../../configs/config');

describe('Testing JWT service', function(){
    var user = {
        _id : "12345"
    };
    it('should return a valid JWT when passing a user', function(){
        var token = jwtService.generateToken(user);
        var decoded = jwt.decode(token, config.jwtTokenSecret, true, config.jwtAlgorithm);
        decoded.sub.should.be.equal(user._id);
    });
});