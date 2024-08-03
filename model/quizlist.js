const mongoose = require('mongoose');

const QuizlistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    startTime: { type: String, required: true },
    expireTime: { type: String, required: true },
    date: { type: Date, required: true },
    quizStatus: { type: String, enum: ['active', 'inactive', 'completed', 'expired'], default: 'inactive' }
});


const Quizlist = mongoose.model('Quizlist', QuizlistSchema, 'quizlist');

module.exports = Quizlist;
