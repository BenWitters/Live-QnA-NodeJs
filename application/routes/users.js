var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var controller = require('../controllers/user');


var User = require('../models/user');

// register & redirect
router.get('/register', controller.renderRegister);

// login & redirect
router.get('/login', controller.renderLogin);

// logout & redirect
router.get('/logout', controller.userLogout);

//als registratieformulier gesubmit is, registreer user
router.post('/register', controller.registerUser);

//sessie
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserId(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    //username, wachtwoord, callback
    function(username, password, done){
             User.getUsername(username, function(err, user){
                 if(err) throw err;
                 // als user niet bestaat
                 if(!user){
                     console.log('unknown user');
                     return done(null, false, {message: 'Gebruiker bestaat niet'});
                 }
                 // user in param komt van getUsername
                 User.matchPassword(password, user.password, function(err, matches){
                     if(err) throw err;
                     if(matches){
                         return done(null, user);
                     }else{
                         console.log('invalid password');
                         return done(null, false, {message: 'invalid password'});
                     }
                 })
             });
    }
));

//password check
router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Ongeldige gebruikersnaam of wachtwoord'}), function(req, res){
    // if localstrategie = true
    res.redirect('/');
});


module.exports = router;
