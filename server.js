var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(morgan('dev'));

app.listen(config.port);

/** Instantiate routes **/
require('./routes/main')(app);

console.log('Magic happens on port: ' + config.port + '. Environment:' + config.environment);


module.exports = app;