var mongoose = require('mongoose');

module.exports = function(config){
    if (!mongoose.connection.db){
        mongoose.connect(config.mongoURI);
        var db = mongoose.connection;

        db.on('error', console.error.bind(console, 'connection error...'));
        db.once('open', function() {
            console.log('Connection to DB is opened');
        });
    }
};