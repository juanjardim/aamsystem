'use strict';
var mongoose = require('mongoose');

var AAMSystemSchema = new mongoose.Schema({
    fields: {},
    createdAt : Date,
    lasUpdate: Date
});

AAMSystemSchema.pre('save', function(next){
    var system = this;
    var now = new Date();
    system.lasUpdate = now;
    if(!system.createdAt){
        system.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('AAMSystem', AAMSystemSchema);