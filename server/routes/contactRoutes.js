const express = require("express");
const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
} = require("../controllers/contactController");
const { authenticateToken, requireRole } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/submit", submitContact);

// Admin-only routes (protected)
router.get("/", authenticateToken, requireRole(["producer"]), getAllContacts);
router.get(
  "/stats",
  authenticateToken,
  requireRole(["producer"]),
  getContactStats
);
router.get(
  "/:id",
  authenticateToken,
  requireRole(["producer"]),
  getContactById
);
router.put(
  "/:id",
  authenticateToken,
  requireRole(["producer"]),
  updateContactStatus
);
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["producer"]),
  deleteContact
);

module.exports = router;
