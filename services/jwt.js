var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../configs/config');
exports.generateToken = function(user){
    var expires = moment().add('days', config.jwtExpiration).valueOf();
    var payload = {
        iss: req.hostname,
        sub: user._id,
        exp: expires
    };
    return jwt.encode(payload, config.jwtTokenSecret, config.jwtAlgorithm);
};