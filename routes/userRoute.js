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
  getQuizById,
  updateQuizResults,
  addUserAttempt,
  requestPasswordReset,
  resetPassword
} = require("../controller/userController");

router.post("/registration", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.put("/updateUser", userMiddleware, updateUser);
router.get("/leaderboard", userMiddleware, getLeaderboard);
router.get("/verify-token", userMiddleware, verifyUserToken);
router.get("/quiz-list", userMiddleware, getQuizzesList);
router.get("/quiz-id", userMiddleware, getQuizById);
router.patch("/submit-result", userMiddleware, updateQuizResults);
router.get("/quiz-list-userattempts", getQuizzesList);
// Add a new user attempt
router.patch('/quizzes/:quizId/attempts',userMiddleware ,addUserAttempt);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
