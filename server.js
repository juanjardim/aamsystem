var express = require('express');

var passport = require('passport');
var app = express();

/**Configuration section **/
var config = require('./configs/config');
require('./configs/passport');
require('./configs/mongoose')(config);
require('./configs/express')(app);

app.use(passport.initialize());
app.listen(config.port);

/** Instantiate routes **/
require('./routes/main')(app);

console.log('Magic happens on port: ' + config.port + '. Environment:' + config.environment);


module.exports = app;