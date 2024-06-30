const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const AdminUser = require('../model/admin');
const Quiz = require('../model/quiz');
const Quizlist = require('../model/quizlist');
const {generateToken} = require('../config/jwt')
const {adminMiddleware} = require('../middleware/authMiddleware');

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = await AdminUser.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const authToken = await generateToken(user._id);
        res.status(200).json({ message: "Login successful", authToken: authToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/createQuizzes', adminMiddleware, async (req, res) => {
    try {
        const { title, time, date, questions } = req.body;

        const quizExist  = await Quiz.findOne({title:title})
        if(quizExist) return  res.status(409).json({ message: "Quiz Already Exist" });

        const newQuiz = new Quiz({
            title,
            time,
            date,
            questions
        });
        

        const quizlist = new Quizlist({
            title,
            time,
            date
        });
        
        await quizlist.save();
        await newQuiz.save();

        res.status(201).json({ message: "New quiz added successfully", newQuiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/totalQuizzes',adminMiddleware,async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = router;