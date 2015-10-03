var jwt = require('../services/jwt');



module.exports = function(app, passport) {
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
                token: jwt.generateToken(req.users)
            });
        })(req, res, next);
    });

};
