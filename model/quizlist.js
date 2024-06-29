const mongoose = require('mongoose');

const QuizlistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
});

const Quizlist = mongoose.model('Quizlist', QuizlistSchema, 'quizlist');

module.exports = Quizlist;
