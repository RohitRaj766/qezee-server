const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const { userMiddleware } = require("../middleware/authMiddleware");
const Quiz = require("../model/quiz");
const Quizlist = require("../model/quizlist");
const User = require("../model/user");
const calculateReputation = require('../utils')

router.get("/quizzesList", userMiddleware, async (req, res) => {
  try {
    const quizzes = await Quizlist.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/quiz/:title", userMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ title: req.params.title });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/registration", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      course,
      branch,
      university,
      college,
      enrollment,
      totalquestions
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !course ||
      !branch ||
      !university ||
      !college ||
      !enrollment
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      course,
      branch,
      university,
      college,
      enrollment,
      totalquestions
    });

    await newUser.save();
    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "All fields are required" });
    const userExsit = await User.findOne({ email: email });
    if (!userExsit) return res.status(404).json({ error: "User Not Found" });
    const matchedPassword = await bcrypt.compare(password, userExsit.password);
    if (!matchedPassword)
      return res.status(401).json({ error: "invalid credentials" });
    const authtok = await generateToken(userExsit._id);
    res
      .status(200)
      .json({
        message: "login successfull",
        LoggedInUser: userExsit,
        authtoken: authtok,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put('/updateUser', userMiddleware, async (req, res) => {
    try {
        const { id, result } = req.body;

        if (!result || !result.correct || !result.wrong || !result.notanswered) {
            return res.status(400).json({ error: "Result object with correct, wrong, and notanswered fields is required" });
        }

        const user = await User.findById({_id:id});

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.totalquestions = {
            correct: result.correct,
            wrong: result.wrong,
            notattempted: result.notanswered
        };
  
        await user.save();
        res.status(200).json({ message: "User updated successfully", updatedUser: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




router.get('/leaderboard', userMiddleware, async (req, res) => {
    try {
        
        const users = await User.find({}, 'firstname college enrollment totalquestions.correct');
        
        const leaderboard = users.map(user => {
            const totalCorrect = user.totalquestions.correct || 0;
            const reputation = calculateReputation(totalCorrect);

            return {
                firstname: user.firstname,
                college: user.college,
                enrollment: user.enrollment,
                totalCorrect: totalCorrect,
                reputation: reputation
            };
        });
        
        leaderboard.sort((a, b) => b.totalCorrect - a.totalCorrect);
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
