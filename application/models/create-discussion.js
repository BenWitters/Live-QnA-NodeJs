var mongoose = require('mongoose');


var id = new mongoose.Types.ObjectId();
var topicSchema = mongoose.Schema({
    author: String,
    title: String,
    date: String,
    questions: [{
        name: String,
        text: String,
        date: String,
        answers: [{
            name: String,
            text: String,
            date: String
        }]
    }]
});



var Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;

