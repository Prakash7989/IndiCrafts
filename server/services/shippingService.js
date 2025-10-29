const axios = require("axios");

// India Post shipping rates (as of 2024)
const INDIA_POST_RATES = {
  // Domestic rates for different weight categories (in grams)
  domestic: {
    0: 25, // Up to 50g
    50: 40, // 51g to 100g
    100: 60, // 101g to 250g
    250: 80, // 251g to 500g
    500: 120, // 501g to 1kg
    1000: 200, // 1kg to 2kg
    2000: 300, // 2kg to 3kg
    3000: 400, // 3kg to 4kg
    4000: 500, // 4kg to 5kg
  },
  // Express rates (higher but faster)
  express: {
    0: 50,
    50: 80,
    100: 120,
    250: 160,
    500: 240,
    1000: 400,
    2000: 600,
    3000: 800,
    4000: 1000,
  },
};

// IIT Kharagpur coordinates (reference point / hub)
const IIT_KGP_COORDINATES = {
  latitude: 22.3149,
  longitude: 87.3105,
};

class ShippingService {
  constructor() {
    // Simple in-memory cache for postal-code -> geocode results to avoid hitting Nominatim repeatedly
    // Map key -> { value: <geoObj>, expiresAt: <timestamp> }
    this._geocodeCache = new Map();
    this._GEOCODE_CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
    this._GEOCODE_CACHE_MAX = 5000; // maximum number of cached entries
  }
  /**
   * Geocode a postal code (pincode) to latitude/longitude using Nominatim.
   * Note: This is a simple server-side geocode for development. For production
   * use a paid geocoding provider and cache results to avoid rate limits.
   * @param {string} postalCode
   * @returns {Object|null} { latitude, longitude, address, city, state, country, postalCode }
   */
  async geocodePostalCode(postalCode) {
    if (!postalCode) return null;
    const key = String(postalCode).trim();

    // Check cache
    try {
      const cached = this._geocodeCache.get(key);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.value;
      }
    } catch (e) {
      // ignore cache read errors
    }

    try {
      const q = `${postalCode} India`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(
        q
      )}`;
      const res = await axios.get(url, {
        headers: { "User-Agent": "IndiCrafts-Server/1.0" },
        timeout: 5000,
      });
      const data = res.data;
      if (!data || data.length === 0) return null;
      const first = data[0];
      const result = {
        latitude: Number(first.lat),
        longitude: Number(first.lon),
        address: first.display_name,
        city: (first.address && (first.address.city || first.address.town || first.address.village)) || null,
        state: (first.address && first.address.state) || null,
        country: (first.address && first.address.country) || 'India',
        postalCode: (first.address && first.address.postcode) || postalCode,
      };

      // Store in cache
      try {
        // prune if needed
        if (this._geocodeCache.size >= this._GEOCODE_CACHE_MAX) {
          // remove oldest entry
          const firstKey = this._geocodeCache.keys().next().value;
          if (firstKey) this._geocodeCache.delete(firstKey);
        }
        this._geocodeCache.set(key, { value: result, expiresAt: Date.now() + this._GEOCODE_CACHE_TTL });
      } catch (e) {
        // ignore cache write errors
      }

      return result;
    } catch (err) {
      console.warn('Server geocode failed for', postalCode, err?.message || err);
      return null;
    }
  }

  /**
   * Calculate shipping cost based on weight and distance
   * @param {number} weight - Weight in grams
   * @param {Object} producerLocation - Producer location coordinates
   * @param {string} serviceType - 'domestic' or 'express'
   * @returns {Object} Shipping cost details
   */
  calculateShippingCost(weight, producerLocation, serviceType = "domestic") {
    try {
      // Calculate base shipping cost based on weight
      const baseCost = this.getBaseShippingCost(weight, serviceType);

      // Calculate distance-based surcharge
      const distanceSurcharge =
        this.calculateDistanceSurcharge(producerLocation);

      // Also compute numeric distance (km) when location is available to aid debugging
      let distanceKm = null;
      if (
        producerLocation &&
        producerLocation.latitude &&
        producerLocation.longitude
      ) {
        try {
          distanceKm = Number(
            this.calculateDistance(
              IIT_KGP_COORDINATES.latitude,
              IIT_KGP_COORDINATES.longitude,
              producerLocation.latitude,
              producerLocation.longitude
            ).toFixed(2)
          );
        } catch (e) {
          distanceKm = null;
        }
      }

      // Calculate total shipping cost
      const totalShippingCost = baseCost + distanceSurcharge;

      return {
        baseCost,
        distanceSurcharge,
        distanceKm,
        totalCost: Math.round(totalShippingCost),
        weight,
        serviceType,
        breakdown: {
          weightCategory: this.getWeightCategory(weight),
          baseRate: baseCost,
          distanceCharge: distanceSurcharge,
          distanceKm,
          total: totalShippingCost,
        },
      };
    } catch (error) {
      console.error("Error calculating shipping cost:", error);
      // Return default cost if calculation fails
      return {
        baseCost: 50,
        distanceSurcharge: 0,
        totalCost: 50,
        weight,
        serviceType,
        error: "Failed to calculate shipping cost",
      };
    }
  }

  /**
   * Get base shipping cost based on weight
   */
  getBaseShippingCost(weight, serviceType) {
    const rates = INDIA_POST_RATES[serviceType] || INDIA_POST_RATES.domestic;

    // Find the appropriate rate based on weight
    const weightCategories = Object.keys(rates)
      .map(Number)
      .sort((a, b) => a - b);

    for (let i = weightCategories.length - 1; i >= 0; i--) {
      if (weight >= weightCategories[i]) {
        return rates[weightCategories[i]];
      }
    }

    // If weight is less than the smallest category, use the first rate
    return rates[weightCategories[0]] || 25;
  }

  /**
   * Calculate distance-based surcharge
   */
  calculateDistanceSurcharge(producerLocation) {
    if (
      !producerLocation ||
      !producerLocation.latitude ||
      !producerLocation.longitude
    ) {
      return 0; // No surcharge if location is not available
    }

    try {
      const distance = this.calculateDistance(
        IIT_KGP_COORDINATES.latitude,
        IIT_KGP_COORDINATES.longitude,
        producerLocation.latitude,
        producerLocation.longitude
      );

      // India Post Speed Post distance slabs approximation
      // Local, 0–200, 201–500, 501–1000, 1001–2000, >2000 km
      if (distance <= 30) {
        // Local (<=30km) — small surcharge
        return 10;
      } else if (distance <= 200) {
        // Nearby region (<=200km)
        return 10;
      } else if (distance <= 500) {
        return 20;
      } else if (distance <= 1000) {
        return 40;
      } else if (distance <= 2000) {
        return 60;
      } else {
        return 80;
      }
    } catch (error) {
      console.error("Error calculating distance surcharge:", error);
      return 0;
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  /**
   * Convert degrees to radians
   */
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  /**
   * Get weight category description
   */
  getWeightCategory(weight) {
    if (weight <= 50) return "Up to 50g";
    if (weight <= 100) return "51g to 100g";
    if (weight <= 250) return "101g to 250g";
    if (weight <= 500) return "251g to 500g";
    if (weight <= 1000) return "501g to 1kg";
    if (weight <= 2000) return "1kg to 2kg";
    if (weight <= 3000) return "2kg to 3kg";
    if (weight <= 4000) return "3kg to 4kg";
    return "4kg to 5kg";
  }

  /**
   * Get shipping cost for a product (producer to IIT KGP)
   * @param {Object} product - Product object with weight and location
   * @param {string} serviceType - 'domestic' or 'express'
   * @returns {Object} Shipping cost details
   */
  getProductShippingCost(product, serviceType = "domestic") {
    const weight = product.weight || 0;
    const location = product.location;

    return this.calculateShippingCost(weight, location, serviceType);
  }

  /**
   * Get shipping cost from IIT KGP to customer location
   * @param {number} weight - Weight in grams
   * @param {Object} customerLocation - Customer location coordinates
   * @param {string} serviceType - 'domestic' or 'express'
   * @returns {Object} Shipping cost details
   */
  getCustomerShippingCost(weight, customerLocation, serviceType = "domestic") {
    // Calculate shipping from IIT KGP to customer location
    return this.calculateShippingCost(weight, customerLocation, serviceType);
  }

  /**
   * Calculate total price including shipping (producer to IIT KGP)
   * @param {number} basePrice - Product base price
   * @param {Object} product - Product object with weight and location
   * @param {string} serviceType - 'domestic' or 'express'
   * @returns {Object} Total price breakdown
   */
  calculateTotalPrice(basePrice, product, serviceType = "domestic") {
    const shippingCost = this.getProductShippingCost(product, serviceType);
    // Commission (platform fee) - 5% of base price
    const commission = Number((basePrice * 0.05).toFixed(2));
    const totalPrice = Number((basePrice + shippingCost.totalCost + commission).toFixed(2));

    return {
      basePrice,
      shippingCost: shippingCost.totalCost,
      commission,
      totalPrice,
      breakdown: {
        productPrice: basePrice,
        shipping: shippingCost,
        commission,
        total: totalPrice,
      },
    };
  }

  /**
   * Calculate customer-facing price (base price + shipping from IIT KGP to customer)
   * @param {number} basePrice - Product base price
   * @param {number} weight - Product weight
   * @param {Object} customerLocation - Customer location coordinates
   * @param {string} serviceType - 'domestic' or 'express'
   * @returns {Object} Customer price breakdown
   */
  calculateCustomerPrice(
    basePrice,
    weight,
    customerLocation,
    serviceType = "domestic"
  ) {
    const shippingCost = this.getCustomerShippingCost(
      weight,
      customerLocation,
      serviceType
    );
    const commission = Number((basePrice * 0.05).toFixed(2));
    const totalPrice = Number((basePrice + shippingCost.totalCost + commission).toFixed(2));

    return {
      basePrice,
      shippingCost: shippingCost.totalCost,
      commission,
      totalPrice,
      breakdown: {
        productPrice: basePrice,
        shipping: shippingCost,
        commission,
        total: totalPrice,
      },
    };
  }
}

module.exports = new ShippingService();
