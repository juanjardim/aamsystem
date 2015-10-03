var passport = require('passport');
var jwt = require('jwt-simple');
var moment = require('moment');


module.exports = function(app, config){
    app.post('/login', function(req, res, next){
        var auth = passport.authenticate('local-login', function(err, user){
            if(err) { return next(err);}
            if(!user){ return next(err);}

            var expires = moment().add('days', config.jwtExpiration).valueOf();
            var payload = {
                iss: req.hostname,
                sub: user._id,
                exp: expires
            };

            var token = jwt.encode(payload, config.jwtTokenSecret, config.jwtAlgorithm);

            res.json({
                success: true,
                token: token
            });
        });
    });
};