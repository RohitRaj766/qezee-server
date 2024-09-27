const mongoose = require('mongoose');

// individual quiz Leaderboard
const userAttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User schema
        required: true
    },
    name: {
        type: String,
        required: true
    },
    enrollment: {
        type: String,
        required: true
    },
    correctAnswers: {
        type: Number,
        default: 0
    },
    wrongAnswers: {
        type: Number,
        default: 0
    },
    notattempted: {
        type: Number,
        default: 0
    }
});



// Define the schema for an individual question
const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        a: { type: String, required: true },
        b: { type: String, required: true },
        c: { type: String, required: true },
        d: { type: String, required: true }
    },
    correctAnswer: {
        type: String,
        required: true,
        enum: ['a', 'b', 'c', 'd']
    }
});

// Define the schema for a single quiz
const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    startTime: { type: String, required: true },
    expireTime: { type: String, required: true },
    quizStatus: { type: String, required: true },
    date: {
        type: Date,
        default: Date.now
    },
    questions: [questionSchema],
    userAttemptedList: [userAttemptSchema]
});

// Create a model for the quiz
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = {
    userAttemptSchema,
    questionSchema,
    quizSchema,
    Quiz
};