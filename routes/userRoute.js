const express = require("express");
const router = express.Router();
const { userMiddleware } = require("../middleware/authMiddleware");
const {
  registerUser,
  verifyOtp,
  updateUser,
  getLeaderboard,
  loginUser,
  verifyUserToken,
  getQuizzesList,
  getQuizByTitle,
  updateQuizResults,
  addUserAttempt
} = require("../controller/userController");

router.post("/registration", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.put("/updateUser", userMiddleware, updateUser);
router.get("/leaderboard", userMiddleware, getLeaderboard);
router.get("/verify-token", userMiddleware, verifyUserToken);
router.get("/quiz-list", userMiddleware, getQuizzesList);
router.get("/quiz-title", userMiddleware, getQuizByTitle);
router.patch("/submit-result", userMiddleware, updateQuizResults);
router.get("/quiz-list-userattempts", getQuizzesList);
// Add a new user attempt
router.patch('/quizzes/:quizId/attempts',userMiddleware ,addUserAttempt);

module.exports = router;
