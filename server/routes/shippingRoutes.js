const express = require("express");
const router = express.Router();
const shippingService = require("../services/shippingService");

// Calculate shipping cost for a product
router.post("/calculate", async (req, res) => {
  try {
    const { weight, location, serviceType = "domestic" } = req.body;

    if (!weight || weight < 0) {
      return res.status(400).json({
        message: "Valid weight is required",
        error: "Weight must be a positive number",
      });
    }

    const shippingCost = shippingService.calculateShippingCost(
      Number(weight),
      location,
      serviceType
    );

    res.json({
      success: true,
      shippingCost,
      message: "Shipping cost calculated successfully",
    });
  } catch (error) {
    console.error("Shipping calculation error:", error);
    res.status(500).json({
      message: "Failed to calculate shipping cost",
      error: error.message,
    });
  }
});

// Calculate total price including shipping for a product
router.post("/total-price", async (req, res) => {
  try {
    const { basePrice, weight, location, serviceType = "domestic" } = req.body;

    if (!basePrice || basePrice < 0) {
      return res.status(400).json({
        message: "Valid base price is required",
        error: "Base price must be a positive number",
      });
    }

    if (!weight || weight < 0) {
      return res.status(400).json({
        message: "Valid weight is required",
        error: "Weight must be a positive number",
      });
    }

    const product = { weight: Number(weight), location };
    const totalPrice = shippingService.calculateTotalPrice(
      Number(basePrice),
      product,
      serviceType
    );

    res.json({
      success: true,
      totalPrice,
      message: "Total price calculated successfully",
    });
  } catch (error) {
    console.error("Total price calculation error:", error);
    res.status(500).json({
      message: "Failed to calculate total price",
      error: error.message,
    });
  }
});

// Calculate customer shipping cost (IIT KGP to customer location)
router.post("/customer-shipping", async (req, res) => {
  try {
    const { weight, customerLocation, serviceType = "domestic" } = req.body;

    if (!weight || weight < 0) {
      return res.status(400).json({
        message: "Valid weight is required",
        error: "Weight must be a positive number",
      });
    }

    if (
      !customerLocation ||
      !customerLocation.latitude ||
      !customerLocation.longitude
    ) {
      return res.status(400).json({
        message: "Customer location is required",
        error: "Customer location with coordinates must be provided",
      });
    }

    const shippingCost = shippingService.getCustomerShippingCost(
      Number(weight),
      customerLocation,
      serviceType
    );

    res.json({
      success: true,
      shippingCost,
      message: "Customer shipping cost calculated successfully",
    });
  } catch (error) {
    console.error("Customer shipping calculation error:", error);
    res.status(500).json({
      message: "Failed to calculate customer shipping cost",
      error: error.message,
    });
  }
});

// Calculate customer total price (base price + shipping from IIT KGP to customer)
router.post("/customer-total-price", async (req, res) => {
  try {
    const {
      basePrice,
      weight,
      customerLocation,
      serviceType = "domestic",
    } = req.body;

    if (!basePrice || basePrice < 0) {
      return res.status(400).json({
        message: "Valid base price is required",
        error: "Base price must be a positive number",
      });
    }

    if (!weight || weight < 0) {
      return res.status(400).json({
        message: "Valid weight is required",
        error: "Weight must be a positive number",
      });
    }

    if (
      !customerLocation ||
      !customerLocation.latitude ||
      !customerLocation.longitude
    ) {
      return res.status(400).json({
        message: "Customer location is required",
        error: "Customer location with coordinates must be provided",
      });
    }

    const totalPrice = shippingService.calculateCustomerPrice(
      Number(basePrice),
      Number(weight),
      customerLocation,
      serviceType
    );

    res.json({
      success: true,
      totalPrice,
      message: "Customer total price calculated successfully",
    });
  } catch (error) {
    console.error("Customer total price calculation error:", error);
    res.status(500).json({
      message: "Failed to calculate customer total price",
      error: error.message,
    });
  }
});

// Get shipping rates information
router.get("/rates", (req, res) => {
  try {
    const rates = {
      domestic: {
        description: "Standard domestic shipping",
        rates: {
          "Up to 50g": 25,
          "51g to 100g": 40,
          "101g to 250g": 60,
          "251g to 500g": 80,
          "501g to 1kg": 120,
          "1kg to 2kg": 200,
          "2kg to 3kg": 300,
          "3kg to 4kg": 400,
          "4kg to 5kg": 500,
        },
      },
      express: {
        description: "Express domestic shipping",
        rates: {
          "Up to 50g": 50,
          "51g to 100g": 80,
          "101g to 250g": 120,
          "251g to 500g": 160,
          "501g to 1kg": 240,
          "1kg to 2kg": 400,
          "2kg to 3kg": 600,
          "3kg to 4kg": 800,
          "4kg to 5kg": 1000,
        },
      },
    };

    res.json({
      success: true,
      rates,
      message: "Shipping rates retrieved successfully",
    });
  } catch (error) {
    console.error("Rates retrieval error:", error);
    res.status(500).json({
      message: "Failed to retrieve shipping rates",
      error: error.message,
    });
  }
});

module.exports = router;
