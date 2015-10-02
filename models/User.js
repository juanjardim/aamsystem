var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    username : String,
    email: String,
    password: {type: String, select: false}
});

UserSchema.pre('save', function(next){
    var user = this;

    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(10, function(err, salt){
        if(err){
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err) {
                return next(err);
            }
            user.password = hash;
            next();
        })
    })

});


UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};


exports.model = mongoose.model('User', UserSchema);