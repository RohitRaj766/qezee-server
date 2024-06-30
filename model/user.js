const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    enrollment: {
        type: String,
        required: true
    },
    totalquestions: {
        correct: {
            type: Number,
            default: 0
        },
        wrong: {
            type: Number,
            default: 0
        },
        notattempted: {
            type: Number,
            default: 0
        }
    }
});

const User = mongoose.model('User', userSchema, 'user');

module.exports = User;
