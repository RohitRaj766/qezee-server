const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
const Quiz = require('../model/quiz')
const Quizlist = require('../model/quizlist')

router.get('/quizzesList', async (req, res) => {
    try {
        const quizzes = await Quizlist.find({}, 'title date time');
        res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/quiz/:title', async (req, res) => {
    try {
        const quiz = await Quiz.findOne({title:req.params.title});
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
});



module.exports = router;