var express = require('express');
var router = express.Router();

module.exports = function(app){
    router.get('/', function(req, res){
        res.send('Welcome to AAMSystem API. To continue, you have to be authenticated');
    });
    app.use('/', router);
};