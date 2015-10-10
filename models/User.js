'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    roles: [{
        type: String
    }],
    groups: [{
        type: String
    }],
    permissions: [{
        type: String
    }],
    fields: {},
    active: {
        type: Boolean,
        default: true
    },
    password: {type: String, select: false}
});

UserSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, callback);
};

UserSchema.methods.toJSON = function () {
    var user = this.toObject();
    delete user.password;
    return user;
};

UserSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(4, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});


module.exports = mongoose.model('User', UserSchema);