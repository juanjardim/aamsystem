var jwt = require('../services/jwt');
var passport = require('passport');


module.exports = function(app) {
    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (! user) {
                return res.status(401).send(info);
            }

            res.json({
                success: true,
                token: jwt.generateToken(user)
            });
        })(req, res, next);
    });
};
