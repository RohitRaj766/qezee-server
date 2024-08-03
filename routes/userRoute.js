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
  getQuizByTitle
} = require("../controller/userController");

router.post("/registration", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.put("/updateUser", userMiddleware, updateUser);
router.get("/leaderboard", userMiddleware, getLeaderboard);
router.get("/verify-token", userMiddleware, verifyUserToken);
router.get("/quiz-list", userMiddleware, getQuizzesList);
router.get("/quiz-title", userMiddleware, getQuizByTitle);

module.exports = router;
