var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../configs/config');
exports.generateToken = function (user) {
    var expires = moment().add(config.jwtExpiration, 'days').valueOf();
    var payload = {
        sub: user._id,
        exp: expires,
        roles: user.roles
    };
    return jwt.encode(payload, config.jwtTokenSecret, config.jwtAlgorithm);
    //return payload;
};

exports.validateToken = function (token) {
    var response = {
        errorId: 0,
        errorText: ''
    };
    var payload = jwt.decode(token, config.jwtTokenSecret, true, config.jwtAlgorithm);
    if(payload === null){
        response.errorId = 1;
        response.errorText = 'Invalid Token';
        return response;
    }

    if(payload.exp < moment().valueOf()){
        response.errorId = 1;
        response.errorText = 'Token has expired';
        return response;
    }

    response.payload = payload;
    return response;

};