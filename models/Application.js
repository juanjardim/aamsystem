'use strict';
var mongoose = require('mongoose');

var ApplicationSchema = new mongoose.Schema({
    name : String,
    description: String,
    status: String,
    createdAt: Date,
    lastUpdate: Date,
    dns: String
});

ApplicationSchema.pre('save', function(next){
    var application = this;
    var now = new Date();
    application.lastUpdate = now;
    if(!application.createdAt){
        application.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Application', ApplicationSchema);