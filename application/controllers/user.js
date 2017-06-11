var User = require('../models/user');


// render register page
function renderRegister(req, res, next){
    res.render('register', {'title': 'Registreer - Live Q&A app'});
}
module.exports.renderRegister = renderRegister;

//render login page
function renderLogin(req, res, next){
    res.render('login', {'title': 'Login - Live Q&A app'});
}
module.exports.renderLogin = renderLogin;

// registreer user
function registeruser(req, res, next){

    // ophalen van formulier gegevens
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var passwordRepeat = req.body.passwordRepeat;

    // check dat er een image is uploaded
    if(req.files && req.files.profileImage){
        console.log("uploading file");

        // foto informatie
        var profileImgOriginalName = req.files.profileImage.originalname;
        var profileImgName = req.files.profileImage.name;
        var profileImgMime = req.files.profileImage.mimetype;
        var profileImgPath = req.files.profileImage.path;
        var profileImgExt = req.files.profileImage.extension;
        var profileImgSize = req.files.profileImage.size;
    }else{
        // default image als gebruiker geen img selecteerd
        var profileImgName = 'default.png';
    }

    // validatie via express-validation (veldnaam,errMessage
    req.checkBody('name','Naam is verplicht').notEmpty();
    req.checkBody('email','E-mail adres is verplicht').notEmpty();
    req.checkBody('email','Het opgegeven e-mail adres is niet geldig').isEmail();
    req.checkBody('username','Gebruikersnaam is verplicht').notEmpty();
    req.checkBody('password','Geef een wachtwoord in').notEmpty();
    req.checkBody('passwordRepeat','Wachtwoorden komen niet overeen').equals(req.body.password);

    // email or username al in de database?
    User.schema.path('email').validate(function(value, respond) {
        User.findOne({email: value}, function(err, user) {
            if(err) throw err;
            if(user) return respond(false);
            respond(true);
        });
    }, 'Er is al een gebruiker met dit email adres geregistreerd');

    User.schema.path('username').validate(function(value, respond) {
        User.findOne({username: value}, function(err, user) {
            if(err) throw err;
            if(user) return respond(false);
            respond(true);
        });
    }, 'Deze gebruikersnaam is bezet');

    //error check
    var errors = req.validationErrors();




    // als er errors zijn
    if(errors){

    res.render('register',{
        // velden die correct zijn ingevuld niet leeg maken
        errors: errors,
        name: name,
        email: email,
        username: username,
        password: password,
        passwordRepeat: passwordRepeat
    });
    // geen errors: nieuwe user aanmaken
}else{
    // object creëren verwijst naar model
    var user = new User({
        name: name,
        email: email,
        username: username,
        password: password,
        profileImage: profileImgName
    });

    // user creëren
    User.createUser(user, function(err){
        errors = err;
        console.log(errors);

    });



    // als de user succesvol aangemaakt is
    req.flash('success', 'Je account is aangemaakt!');
    // naar homepage gaan
    res.location('/');
    res.redirect('/');
}
}
module.exports.registerUser = registeruser;


//logout
function userLogout(req, res){
    req.logout();
    req.flash('success', 'Je bent uitgelogd');
    res.redirect('/users/login');

}

module.exports.userLogout = userLogout;