const express = require("express");
const router = express.Router();
const { userMiddleware } = require("../middleware/authMiddleware");
const {
  registerUser,
  verifyOtp,
  updateUser,
  getLeaderboard,
  loginUser,
} = require("../controller/userController");

router.post("/registration", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.put("/updateUser", userMiddleware, updateUser);
router.get("/leaderboard", userMiddleware, getLeaderboard);

module.exports = router;
