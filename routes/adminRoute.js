const express = require("express");
const router = express.Router();
const { adminMiddleware } = require("../middleware/authMiddleware");
const {
  loginAdmin,
  createQuiz,
  getTotalQuizzes
} = require("../controller/adminController");

router.post('/login', loginAdmin);
router.post('/createQuizzes', adminMiddleware, createQuiz);
router.get('/totalQuizzes', adminMiddleware, getTotalQuizzes);

module.exports = router;
