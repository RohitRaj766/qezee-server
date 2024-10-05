const bcrypt = require('bcryptjs');
const AdminUser = require('../model/admin');
const {Quiz} = require('../model/quiz');
const Quizlist = require('../model/quizlist');
const { generateToken } = require('../config/jwt');
const mongoose = require('mongoose');

const loginAdmin = async (req, res) => {
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

    checkAndUpdateAllQuizzes();
    const authToken = await generateToken(user._id);
    res.status(200).json({ message: "Login successful", authToken: authToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createQuiz = async (req, res) => {
  checkAndUpdateAllQuizzes();
  try {
    const { title, startTime, expireTime, quizStatus, date, questions } = req.body;

    const newId = new mongoose.Types.ObjectId();

    const newQuiz = new Quiz({
      _id: newId,
      title,
      startTime,
      expireTime,
      date,
      quizStatus,
      questions
    });

    const quizlist = new Quizlist({
      _id: newId,
      title,
      startTime,
      expireTime,
      date,
      quizStatus
    });

    await quizlist.save();
    await newQuiz.save();
    checkAndUpdateAllQuizzes();
    res.status(201).json({ message: "New quiz added successfully", newQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTotalQuizzes = async (req, res) => {
  checkAndUpdateAllQuizzes();
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkAndUpdateAllQuizzes = async () => {
  const quizzes = await Quiz.find({ quizStatus: 'inactive' });
  const quizlist = await Quizlist.find({ quizStatus: 'inactive' });
 
  const convertToIST = (date) => {
    const istOffset = 5.5 * 60 * 60 * 1000;
    return new Date(date.getTime());
  };
  
  const checkAndUpdate = async (quiz) => {
    const currentDateTimeUTC = new Date();

    const currentDateTimeIST = convertToIST(currentDateTimeUTC);
    const expireDateTimeUTC = new Date(quiz.expireTime);
    const expireDateTimeIST = convertToIST(expireDateTimeUTC);

    let flag = currentDateTimeIST > expireDateTimeUTC;
    if (flag) {
      quiz.quizStatus = 'expired';
      await quiz.save();
      // console.log(`Quiz with ID: ${quiz._id} expired and status updated.`);
    }
  };
  quizzes.forEach(async (quiz) => {
    await checkAndUpdate(quiz);
  });

  quizlist.forEach(async (quiz) => {
    await checkAndUpdate(quiz);
  });
};


module.exports = {
  loginAdmin,
  createQuiz,
  getTotalQuizzes,
  checkAndUpdateAllQuizzes
};
