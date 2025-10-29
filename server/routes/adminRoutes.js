const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require("../middleware/auth");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const shippingService = require("../services/shippingService");

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

    // Calculate shipping costs and total prices for admin view
    const productsWithShipping = products.map((product) => {
      const shippingCost = shippingService.getProductShippingCost(product);
      const totalPrice = shippingService.calculateTotalPrice(
        product.price,
        product
      );

      return {
        ...product.toObject(),
        shippingCost: shippingCost.totalCost,
        totalPrice: totalPrice.totalPrice,
        priceBreakdown: {
          basePrice: product.price,
          shippingCost: shippingCost.totalCost,
          totalPrice: totalPrice.totalPrice,
          shippingDetails: shippingCost,
          weight: product.weight,
          location: product.location,
        },
      };
    });

    const total = await Product.countDocuments(filter);
    res.json({
      products: productsWithShipping,
      total,
      page: Number(page),
      limit: Number(limit),
    });
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

// GET /api/admin/users - list users, optionally filtered by role
router.get("/users", async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (role === "customer" || role === "producer" || role === "admin") {
      filter.role = role;
    }
    if (search) {
      const regex = new RegExp(String(search), "i");
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { name: regex },
        { email: regex },
      ];
    }

    const query = User.find(filter).sort({ createdAt: -1 });
    const users = await query
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .select(
        "firstName lastName name email role phone isEmailVerified addresses createdAt updatedAt producer"
      );

    const total = await User.countDocuments(filter);
    res.json({ users, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
});

// GET /api/admin/users/:id - get a single user's details
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "firstName lastName name email role phone createdAt updatedAt addresses producer"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: err.message });
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

// GET /api/admin/products/:id/shipping - get detailed shipping information for a product
router.get("/products/:id/shipping", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "producer",
      "firstName lastName email"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const shippingCost = shippingService.getProductShippingCost(product);
    const totalPrice = shippingService.calculateTotalPrice(
      product.price,
      product
    );

    const shippingInfo = {
      product: {
        id: product._id,
        name: product.name,
        basePrice: product.price,
        weight: product.weight,
        location: product.location,
        producer: product.producer,
      },
      shippingCost: shippingCost.totalCost,
      totalPrice: totalPrice.totalPrice,
      breakdown: {
        basePrice: product.price,
        shippingCost: shippingCost.totalCost,
        totalPrice: totalPrice.totalPrice,
        shippingDetails: shippingCost,
      },
      distanceFromIITKGP: product.location
        ? shippingService.calculateDistance(
            22.3149,
            87.3105, // IIT KGP coordinates
            product.location.latitude,
            product.location.longitude
          )
        : null,
    };

    res.json({ shippingInfo });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch shipping information",
      error: err.message,
    });
  }
});

// GET /api/admin/shipping-summary - get shipping cost summary
router.get("/shipping-summary", async (req, res) => {
  try {
    const products = await Product.find({ isApproved: true });

    let totalBasePrice = 0;
    let totalShippingCost = 0;
    let totalCustomerPrice = 0;
    const weightDistribution = {};
    const locationDistribution = {};

    products.forEach((product) => {
      const shippingCost = shippingService.getProductShippingCost(product);
      const totalPrice = shippingService.calculateTotalPrice(
        product.price,
        product
      );

      totalBasePrice += product.price;
      totalShippingCost += shippingCost.totalCost;
      totalCustomerPrice += totalPrice.totalPrice;

      // Weight distribution
      const weightCategory = shippingService.getWeightCategory(
        product.weight || 0
      );
      weightDistribution[weightCategory] =
        (weightDistribution[weightCategory] || 0) + 1;

      // Location distribution
      if (product.location && product.location.state) {
        locationDistribution[product.location.state] =
          (locationDistribution[product.location.state] || 0) + 1;
      }
    });

    const summary = {
      totalProducts: products.length,
      pricing: {
        totalBasePrice,
        totalShippingCost,
        totalCustomerPrice,
        averageShippingCost:
          products.length > 0 ? totalShippingCost / products.length : 0,
      },
      distribution: {
        weight: weightDistribution,
        location: locationDistribution,
      },
    };

    res.json({ summary });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch shipping summary",
      error: err.message,
    });
  }
});

module.exports = router;
