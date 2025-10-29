const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0, min: 0 },
    producer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    producerName: { type: String },
    producerLocation: { type: String },
    weight: { type: Number, min: 0 }, // Weight in grams
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },
    // Moderation fields
    isApproved: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvalNotes: { type: String },
    approvedAt: { type: Date },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Persisted approved pricing snapshot (set by admin on approval)
    approvedFinalPrice: { type: Number },
    approvedPriceBreakdown: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
