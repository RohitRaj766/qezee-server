const express = require("express");
const router = express.Router();
const AdminUser = require('../model/admin');
const Quiz = require('../model/quiz');
const Quizlist = require('../model/quizlist');
const {generateToken} = require('../config/jwt')
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', async(req, res) => {
    try {
        const user = await AdminUser.findOne({username:req.body.username});
        if(!user) return res.status(404).json({message:"no user found"});
        if(user.password == req.body.password) {
            const authTok = await generateToken(user);
            res.status(200).json({message: `Login Successful`, authToken: authTok});
        }else{res.status(401).json({message: `Invalid Password Or Username`})}
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/createQuizzes', authMiddleware, async (req, res) => {
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


router.get('/totalQuizzes',authMiddleware,async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = router;