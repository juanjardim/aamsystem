'use strict';
var mongoose = require('mongoose');

var PermissionSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: String,
    createdAt: Date,
    lastUpdate: Date,
    application: mongoose.Schema.Types.ObjectId
});

PermissionSchema.pre('save', function (next) {
    var permission = this;
    var now = new Date();
    permission.lastUpdate = now;
    if (!permission.createAt) {
        permission.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Permission', PermissionSchema);