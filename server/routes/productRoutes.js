const express = require("express");
const multer = require("multer");
const path = require("path");
const { authenticateToken, requireRole } = require("../middleware/auth");
const {
  createProduct,
  listProducts,
  getProductById,
  listMyProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Use in-memory storage to avoid filesystem dependency
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", listProducts);
// Specific route first to avoid being captured by '/:id'
router.get(
  "/mine",
  authenticateToken,
  requireRole(["producer"]),
  listMyProducts
);
router.get("/:id", getProductById);
router.post(
  "/",
  authenticateToken,
  requireRole(["producer"]),
  upload.single("image"),
  createProduct
);
router.put(
  "/:id",
  authenticateToken,
  requireRole(["producer"]),
  upload.single("image"),
  updateProduct
);
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["producer"]),
  deleteProduct
);

module.exports = router;
