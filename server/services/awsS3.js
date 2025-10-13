const AWS = require("aws-sdk");

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Upload image to AWS S3
 * @param {Buffer} buffer - Image buffer
 * @param {string} key - S3 object key (path)
 * @param {string} contentType - MIME type
 * @returns {Promise<{url: string, key: string}>}
 */
const uploadImage = async (buffer, key, contentType = "image/jpeg") => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read", // Make image publicly accessible
    };

    const result = await s3.upload(params).promise();

    return {
      url: result.Location,
      key: result.Key,
    };
  } catch (error) {
    console.error("AWS S3 upload error:", error);
    throw new Error("Failed to upload image to S3");
  }
};

/**
 * Delete image from AWS S3
 * @param {string} key - S3 object key
 * @returns {Promise<void>}
 */
const deleteImage = async (key) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error("AWS S3 delete error:", error);
    // Don't throw error for delete failures to avoid breaking the flow
  }
};

/**
 * Generate unique S3 key for product image
 * @param {string} originalName - Original filename
 * @param {string} productId - Product ID
 * @returns {string}
 */
const generateImageKey = (originalName, productId) => {
  const timestamp = Date.now();
  const extension = originalName.split(".").pop() || "jpg";
  return `indicrafts/products/${productId}/${timestamp}.${extension}`;
};

module.exports = {
  uploadImage,
  deleteImage,
  generateImageKey,
};
