'use strict';
var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    name: String,
    description: String,
    permissions: [mongoose.Schema.Types.ObjectId],
    permissionsCluster: [mongoose.Schema.Types.ObjectId],
    status: String,
    createdAt: Date,
    lastUpdate: Date
});

GroupSchema.pre('save', function(next){
    var group = this;
    var now = new Date();
    group.lastUpdate = now;
    if(!group.createdAt){
        group.createdAt = now;
    }
    next();
});



module.exports = mongoose.model('Group', GroupSchema);