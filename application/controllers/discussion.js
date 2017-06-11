var Topic = require('../models/create-discussion');
var mongo = require('mongodb');
var db = require('monk')('localhost/qaApp');

function renderCreateDiscussion(req, res, next) {
    res.render('create-discussion', {title: 'Nieuwe discussie - Live Q&A app', user: req.user.username});
}
module.exports.renderCreateDiscussion = renderCreateDiscussion;

function createTopic(req, res){
    var date = new Date();
    var topic = new Topic({
        author: req.user.username,
        title: req.body.topicName,
        date: date
    });
    if(req.body.topicName.length > 0) {
        topic.save(function (err, message) {
            req.flash('success', 'Je discussie is aangemaakt!');
            res.redirect('/');

        });
    }else{
        res.redirect('/discussion/create');

    }
}
module.exports.createTopic = createTopic;

function getTopicById(req, res, next){
    var topics = db.get('topics');
    var questions = db.get('topics.questions');

    // find post per id
   // var questions = topics.findById(req.params.id, 'questions');
    topics.findById(req.params.id, function(err,topic){
        questions.findById(req.params.id, function(err, question){
            // render detail pagina
            res.render('show-discussion',{ "topic": topic, "profileImg": req.user.profileImage, "questions": question})
        });

    });
}
module.exports.getTopicById = getTopicById;

function createQuestion(req,res,next){

    var topicId = req.body.topicId;
    var name = req.user.username;
    var question =  req.body.question;

    //validatie
    req.checkBody("question", "Je hebt nog niets ingevuld.").notEmpty();

    var errors = req.validationErrors();

    if(errors){
        var topics = db.get('topics');
        topics.findById(topicId, function(err, topic){
            res.render('show-discussion', {
                'errors': errors,
                'topic': topic
            });

        });
    }else{
        var date = new Date();
        var topic = {name: name, text: question, date: date};

        var topicss = db.get('topics');

        topicss.update({
                // id moet gelijk zijn aan topicId
                "_id": topicId
                },{
                // push question in question array
                $push:{
                    "questions": topic
                }
            },
            function(err, question){
                if (err){
                    throw err;
                }else{
                    req.flash('success', 'Je vraag is toegevoegd aan deze discussie');
                    res.location('/discussion/' + topicId);
                    res.redirect('/discussion/' + topicId);

                }
            }
        );
    }

}
module.exports.createQuestion = createQuestion;
