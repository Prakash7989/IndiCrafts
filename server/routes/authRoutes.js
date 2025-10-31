const express = require("express");
const {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
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

// Wishlist routes
router.get("/wishlist", authenticateToken, getWishlist);
router.post("/wishlist/:productId", authenticateToken, addToWishlist);
router.delete("/wishlist/:productId", authenticateToken, removeFromWishlist);

module.exports = router;
