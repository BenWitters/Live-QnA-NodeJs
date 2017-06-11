var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs');

// connect to db localhost/database name
mongoose.connect('mongodb://localhost/qaApp');

var db = mongoose.connection;

// schema

var UserSchema = mongoose.Schema({
    // define veld types
    name: {
        type: String
    },
    email: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    // referentie naam naar img
    profileImage: {
        type: String
    }
});


UserSchema.plugin(uniqueValidator);

/*
UserSchema.schema.path('email').validate(function (value, respond) {
    User.findOne({ email: value }, function (err, user) {
        if(user) respond(false);
    });
}, 'Er is al een account met dit e-mail adres geregistreer');
*/

// object beschikbaar maken buiten de file
var User = module.exports = mongoose.model('User', UserSchema);


/*
 UserSchema.path('email').validate(function (value, respond) {
 User.findOne({ email: value }, function (err, user) {
 if(user) respond(false);
 });
 }, 'This email address is already registered');
 */


// registreer user
module.exports.createUser = function(user, callback){
    //password hash, cost

    bcrypt.hash(user.password, 12, function(err, hash){
        if(err) throw err;
        // set hash wachtwoord
        user.password = hash;
        // nieuwe user in db
        user.save(callback);


    });
};

module.exports.getUsername = function(username, callback){
      var find = {username: username};
    User.findOne(find, callback);
};

module.exports.getUserId = function(id, callback){
    User.findById(id, callback);
};

module.exports.matchPassword = function(password, hash, callback){
    bcrypt.compare(password, hash, function(err, matches){
        // bij error return callback
        if(err) return  callback(err);
        callback(null, matches);

    })
};