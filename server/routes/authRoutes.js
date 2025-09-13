const express = require("express");
const {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);

module.exports = router;
