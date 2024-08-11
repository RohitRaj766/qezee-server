const bcrypt = require("bcryptjs");
const User = require("../model/user");
const Quiz = require("../model/quiz");
const Quizlist = require("../model/quizlist");
const { calculateReputation, generateOTP } = require('../utils');
const sendMail = require('../config/mailer');
const { generateToken,verifyToken } = require("../config/jwt");

let otpStore = {};

const registerUser = async (req, res) => {
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

    const otp = generateOTP();
    console.log(otp);
    const expiry = Date.now() + 300000; // OTP expires in 5 minutes

    otpStore[email] = { otp, expiry, user: { firstname, lastname, email, password, course, branch, university, college, enrollment, totalquestions } };

    await sendMail(email, otp);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const otpData = otpStore[email];
    if (!otpData) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    if (Date.now() > otpData.expiry) {
      delete otpStore[email];
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (otpData.otp === otp) {
      const { firstname, lastname, password, course, branch, university, college, enrollment, totalquestions } = otpData.user;

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
      delete otpStore[email];

      return res.status(201).json({ message: "User Registered Successfully" });
    }

    res.status(400).json({ error: 'Invalid OTP' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id, result } = req.body;

    if (!result || !result.correct || !result.wrong || !result.notanswered) {
      return res.status(400).json({ error: "Result object with correct, wrong, and notanswered fields is required" });
    }

    const user = await User.findById({ _id: id });

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
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({}, 'firstname lastname college enrollment totalquestions.correct');
    users.sort((a, b) => b.totalquestions.correct - a.totalquestions.correct);
      const leaderboard = users.map((user, index) => {
      const totalCorrect = user.totalquestions.correct || 0;
      const reputation = calculateReputation(totalCorrect, index);
      return {
        firstname: user.firstname,
        lastname: user.lastname,
        college: user.college,
        enrollment: user.enrollment,
        totalCorrect: totalCorrect,
        reputation: reputation
      };
    });
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getQuizzesList = async (req, res) => {
  try {
    const quizzes = await Quizlist.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getQuizByTitle = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ title: req.query.title });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const userExsit = await User.findOne({ email: email });
    if (!userExsit) {
      return res.status(404).json({ error: "User Not Found" });
    }
    const matchedPassword = await bcrypt.compare(password, userExsit.password);
    if (!matchedPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const authtok = await generateToken(userExsit._id);
    const { password: _, ...userWithoutPassword } = userExsit.toObject();
    res.status(200).json({
      message: "Login successful",
      LoggedInUser: userWithoutPassword,
      authtoken: authtok,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyUserToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header not found' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const result = await verifyToken(token);
    if (!result) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    const userExsit = await User.findById(result.id);
    if (!userExsit) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...WithoutPassword } = userExsit.toObject();
    res.status(200).json({ LoggedInUser: WithoutPassword });
  } catch (error) {
    console.error('Error in verifyUserToken:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const updateQuizResults = async (req, res) => {
  try {
    const { email } = req.query;
    const { quizId, quizTopic, correct, wrong, notattempted, quizStatus } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.totalquestions) {
      user.totalquestions.correct += correct;
      user.totalquestions.wrong += wrong;
      user.totalquestions.notattempted += notattempted;
    }

    const existingQuizUser = user.totalquizzes.find(quiz => quiz.name === quizTopic);

    if (existingQuizUser) {
      existingQuizUser.correct = correct;
      existingQuizUser.wrong = wrong;
      existingQuizUser.notattempted = notattempted;
      existingQuizUser.quizStatus = quizStatus;
    } else {
      user.totalquizzes.push({
        quizId: quizId,
        name: quizTopic,
        correct: correct,
        wrong: wrong,
        notattempted: notattempted,
        quizStatus: quizStatus
      });
    } 

    await user.save();
    res.status(200).json({ 
      message: "Quiz results updated successfully", 
      totalquizzes: user.totalquizzes, 
      totalquestions: user.totalquestions 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  verifyOtp,
  updateUser,
  getLeaderboard,
  getQuizzesList,
  getQuizByTitle,
  loginUser,
  verifyUserToken,
  updateQuizResults
};
