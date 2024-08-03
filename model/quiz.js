const mongoose = require('mongoose');

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
    questions: [questionSchema]
});

// Create a model for the quiz
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
