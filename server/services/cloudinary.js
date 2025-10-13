const cloudinary = require("cloudinary").v2;

// TODO: MIGRATION TO AWS S3
// This Cloudinary service is temporary. We'll migrate to AWS S3 for production.
// See services/awsS3.js for the new implementation.

// Prefer CLOUDINARY_URL if provided, else use individual vars
const {
  CLOUDINARY_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

if (CLOUDINARY_URL) {
  cloudinary.config({ cloudinary_url: CLOUDINARY_URL });
} else {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

// Validate early to provide helpful error messages
const missing = [];
if (!cloudinary.config().api_key)
  missing.push("CLOUDINARY_API_KEY or CLOUDINARY_URL");
if (!cloudinary.config().api_secret)
  missing.push("CLOUDINARY_API_SECRET or CLOUDINARY_URL");
if (!cloudinary.config().cloud_name)
  missing.push("CLOUDINARY_CLOUD_NAME or CLOUDINARY_URL");
if (missing.length) {
  // Throwing here surfaces a clear message in logs on startup/first use
  throw new Error(`Cloudinary env vars missing: ${missing.join(", ")}`);
}

module.exports = { cloudinary };
