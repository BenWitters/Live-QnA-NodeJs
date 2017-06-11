var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/qaApp');




var Topic = require('../models/create-discussion');
var controller = require('../controllers/discussion');


function checkSession(req, res, next){
  // passport authentification
  if(req.isAuthenticated()){
    // if authenticated next
    return next();
  }
  res.redirect('/users/login');
}
//show create page
router.get('/create', checkSession, controller.renderCreateDiscussion);

//create a topic
router.post('/create', checkSession, controller.createTopic);

// topic per id
router.get('/:id', checkSession, controller.getTopicById);



// vraag stellen per topic

router.put('/:id', controller.createQuestion);


module.exports = router;
