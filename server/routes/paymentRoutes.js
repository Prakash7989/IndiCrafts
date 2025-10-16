const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { getRazorpayInstance } = require("../services/razorpay");
const Order = require("../models/Order");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { sendOrderConfirmationEmail } = require("../services/emailService");

// Create an order on Razorpay
router.post("/create-order", async (req, res) => {
  try {
    const {
      amount,
      currency = "INR",
      receipt = "rcpt_1",
      notes = {},
    } = req.body;

    // Validate env configuration early with a clear message
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        message: "Razorpay is not configured on the server",
        hint: "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your backend .env and restart the server",
      });
    }

    const amountNumber = Number(amount);
    if (!amountNumber || amountNumber <= 0) {
      return res
        .status(400)
        .json({ message: "amount is required and must be > 0" });
    }
    const instance = getRazorpayInstance();
    const order = await instance.orders.create({
      amount: Math.round(amountNumber),
      currency,
      receipt,
      notes,
    });
    res.json(order);
  } catch (err) {
    console.error("Razorpay create-order error:", err?.message || err);
    res.status(500).json({
      message: "Failed to create order",
      error: err?.message || "Unknown error",
    });
  }
});

// Verify payment signature
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest("hex");

    const isValid = expectedSignature === razorpay_signature;
    if (!isValid) return res.status(400).json({ message: "Invalid signature" });

    res.json({
      message: "Payment verified",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    res
      .status(500)
      .json({ message: "Verification failed", error: err.message });
  }
});

// Public endpoint to get key id for frontend
router.get("/key", (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID)
    return res.status(500).json({ message: "RAZORPAY_KEY_ID not set" });
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});

// Confirm payment and create order in DB (authenticated)
router.post(
  "/confirm",
  authenticateToken,
  requireRole(["customer"]),
  async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        cart,
        address,
        totals,
        currency = "INR",
      } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: "Missing razorpay fields" });
      }

      // Verify signature
      const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const expectedSignature = hmac.digest("hex");
      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      // Basic cart validation
      if (!cart?.items?.length || !totals?.total) {
        return res.status(400).json({ message: "Invalid cart/totals" });
      }

      // Shape address to schema
      const shippingAddress = {
        fullName: address?.fullName,
        phone: address?.phone,
        line1: address?.addressLine1,
        line2: address?.addressLine2 || "",
        city: address?.city,
        state: address?.state,
        postalCode: address?.postalCode,
        country: address?.country || "India",
      };

      const orderDoc = await Order.create({
        customer: req.user._id,
        items: cart.items.map((it) => ({
          product: it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          imageUrl: it.image,
        })),
        subtotal: totals.subtotal || totals.total,
        shipping: totals.shipping || 0,
        total: totals.total,
        status: "paid",
        shippingAddress,
        paymentProvider: "razorpay",
        paymentCurrency: currency,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });

      // Populate customer for email
      await orderDoc.populate("customer", "email firstName lastName");

      // Fire-and-forget: email confirmation (do not block order response)
      try {
        const customerEmail = orderDoc?.customer?.email || req.user.email;
        if (customerEmail) {
          sendOrderConfirmationEmail(customerEmail, orderDoc);
        }
      } catch (_) {}

      res.status(201).json({ message: "Order recorded", order: orderDoc });
    } catch (err) {
      console.error("Payment confirm error:", err);
      res
        .status(500)
        .json({ message: "Failed to record order", error: err.message });
    }
  }
);

module.exports = router;
