const mongoose = require('mongoose');
const { userAttemptSchema } = require('./quiz');

const QuizlistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    startTime: { type: String, required: true },
    expireTime: { type: String, required: true },
    date: { type: Date, required: true },
    quizStatus: { type: String, enum: ['active', 'inactive', 'completed', 'expired'], default: 'inactive' },
    userAttemptedList: [userAttemptSchema]
});


const Quizlist = mongoose.model('Quizlist', QuizlistSchema, 'quizlist');

module.exports = Quizlist;
