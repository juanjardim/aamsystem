var express = require('express');

var passport = require('passport');
passport.serializeUser(function(user, done){
    done(null, user.id);
});
var app = express();

/**Configuration section **/
var config = require('./configs/config');
require('./configs/mongoose')(config);
require('./configs/express')(app);
var LocalStrategy = require('./services/localStrategy');

passport.use('local-login', LocalStrategy.login);

app.use(passport.initialize());

var server = app.listen(config.port);

/** Instantiate routes **/

require('./routes/main')(app);
require('./routes/authentication')(app, passport);




console.log('Magic happens on port: ' + config.port + '. Environment:' + config.environment);

module.exports = server;
