var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = require('monk')('localhost/qaApp');



// get request to homepage, call function, render: display index.jade, show topics
router.get('/', checkSession, function(req, res, next) {
  //
  var topics = db.get('topics');
  topics.find({},{"sort" : [['date', 'desc']]}, function(err, topics){
    res.render('index', {"topics": topics, title: "Live Q&A app"})
  });
});




function checkSession(req, res, next){
  // passport authentification
  if(req.isAuthenticated()){
    // if authenticated next
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
