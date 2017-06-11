// Require modules.
var express = require('express'),
path = require('path'),
favicon = require('serve-favicon'),
logger = require('morgan'),
expressValidator = require('express-validator'),
cookieParser = require('cookie-parser'),
session = require('express-session'),
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
bodyParser = require('body-parser'),
multer = require('multer'),
flash = require('connect-flash'),
mongo = require('mongodb'),
mongoose = require('mongoose');

// Database variabele
var db = mongoose.connection;

// Define routes.
// Routes/index verwijst naar file in folder.
var routes = require('./routes/index');
var users = require('./routes/users');
var discussion = require('./routes/discussions');

var controller = require('./controllers/discussion');

// Init core express object.
var app = express();

// Websockets.
var server = require('http').createServer(app);
server.listen(1000);
var io = require('socket.io').listen(server);

// Port setup.
var Topic = require('./models/create-discussion');

// Websocket question.
// Connection event, socket that user is using.
io.sockets.on('connection', function(socket){
  //receive event on server side from client
  socket.on('send question', function(data){
    // Question to all users.
    Topic.findByIdAndUpdate({_id: data.topicId},  {$push:{questions: {name: data.name, text: data.question, date: data.date}}}, function(err, room){
      socket.join(data.roomNumber);
      var qId = room;
      console.log(qId);
      Topic.findById({_id: data.topicId}, function(err, room){
        console.log(room.questions);
        // get array of questions
        var array = room.questions;
        // get last element in array
        var qId = array[array.length -1]._id;
        io.sockets.in(data.roomNumber).emit('new question', {question: data.question, username: data.name, qId: qId});

      });
    });
  });
});

// Websocket answer
// Connection event, socket that user is using.

io.sockets.on('connection', function(socket){
  // Receive event on server side from client.
  socket.on('send answer', function(data){
    // Answer to all users.
    console.log('debug');

      Topic.findByIdAndUpdate(data.questionId, {$push:{ answers: {name: data.name, text: data.answer, date: data.date}}}, function(err){
        io.sockets.emit('new answer', {answer: data.answer, username: data.name, qId: data.questionId});
      });



  });
});

// View engine setup, view engine : jade.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// moment
// locals : global variabele
app.locals.moment = require('moment');


// Handle file uploads: dest: image upload destination.
var upload = multer({dest: './uploads'});


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handle express sessies, middleware voor express sessies.
app.use(session({
  secret: 'arkljdfsçzaerjfdklp&aq',
  saveUninitialized: true,
  resave: true
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// Validatie, errorformatter: specify a function that can be used to format the objects.
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(cookieParser());
// In public folder = static pages: css, js.
app.use(express.static(path.join(__dirname, 'public')));

// Use flash connect.
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//*=alle routes
app.get('*', function(req, res, next){
  // locale variabele met user info, geef user object
  res.locals.user = req.user || null;
  next();
});

// define routes: / call routes
app.use('/', routes);
app.use('/users', users);
app.use('/discussion', discussion);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
