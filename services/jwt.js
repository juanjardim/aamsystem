var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../configs/config');
exports.generateToken = function(user){
    var expires = moment().add(config.jwtExpiration, 'days').valueOf();
    var payload = {
        sub: user._id,
        exp: expires
    };
    return jwt.encode(payload, config.jwtTokenSecret, config.jwtAlgorithm);
    //return payload;
};