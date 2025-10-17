const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require("../middleware/auth");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// All admin routes require admin auth
router.use(authenticateToken, requireRole(["admin"]));

// GET /api/admin/products - list products by approval status (default: pending)
router.get("/products", async (req, res) => {
  try {
    const { status = "pending", page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status === "pending") filter.approvalStatus = "pending";
    if (status === "approved") filter.approvalStatus = "approved";
    if (status === "rejected") filter.approvalStatus = "rejected";

    const products = await Product.find(filter)
      .populate("producer", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);
    res.json({ products, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: err.message });
  }
});

// POST /api/admin/products/:id/approve - approve a product
router.post("/products/:id/approve", async (req, res) => {
  try {
    const { notes } = req.body || {};
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isApproved = true;
    product.approvalStatus = "approved";
    product.approvalNotes = notes || undefined;
    product.approvedAt = new Date();
    product.approvedBy = req.user._id;
    await product.save();

    res.json({ message: "Product approved", product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to approve product", error: err.message });
  }
});

// POST /api/admin/products/:id/reject - reject a product
router.post("/products/:id/reject", async (req, res) => {
  try {
    const { notes } = req.body || {};
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isApproved = false;
    product.approvalStatus = "rejected";
    product.approvalNotes = notes || undefined;
    product.approvedAt = undefined;
    product.approvedBy = undefined;
    await product.save();

    res.json({ message: "Product rejected", product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to reject product", error: err.message });
  }
});

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const [
      usersCount,
      producersCount,
      productsCount,
      ordersCount,
      paidOrdersCount,
      totalRevenueAgg,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: "producer" }),
      Product.countDocuments({}),
      Order.countDocuments({}),
      Order.countDocuments({ status: "paid" }),
      Order.aggregate([
        { $match: { status: { $in: ["paid", "shipped", "delivered"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    const totalRevenue = totalRevenueAgg?.[0]?.total || 0;

    res.json({
      stats: {
        usersCount,
        producersCount,
        productsCount,
        ordersCount,
        paidOrdersCount,
        totalRevenue,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch stats", error: err.message });
  }
});

// GET /api/admin/orders
router.get("/orders", async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate("customer", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({ orders, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
});

// GET /api/admin/orders/:id
router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customer",
      "firstName lastName email"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: err.message });
  }
});

module.exports = router;
