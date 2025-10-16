const Product = require("../models/Product");
const { cloudinary } = require("../services/cloudinary");
// TODO: MIGRATION TO AWS S3 - Uncomment when ready to switch
// const { uploadImage, deleteImage, generateImageKey } = require("../services/awsS3");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, producerLocation } =
      req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // TODO: MIGRATION TO AWS S3
    // Current implementation uses Cloudinary (temporary)
    // Future implementation will use AWS S3:
    /*
    const productId = new mongoose.Types.ObjectId();
    const imageKey = generateImageKey(req.file.originalname, productId.toString());
    const uploadResult = await uploadImage(req.file.buffer, imageKey, req.file.mimetype);
    
    const product = await Product.create({
      name,
      description,
      price,
      category,
      quantity: quantity ? Number(quantity) : 0,
      imageUrl: uploadResult.url,
      imagePublicId: uploadResult.key, // Store S3 key instead of Cloudinary public_id
      producer: req.user._id,
      producerName: req.user.firstName || req.user.name || "",
      producerLocation: producerLocation || "",
    });
    */

    // CURRENT CLOUDINARY IMPLEMENTATION (TEMPORARY)
    const uploadFromBuffer = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "indicrafts/products", resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(buffer);
      });

    const uploadResult = await uploadFromBuffer(req.file.buffer);

    const product = await Product.create({
      name,
      description,
      price,
      category,
      quantity: quantity ? Number(quantity) : 0,
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      producer: req.user._id,
      producerName: req.user.firstName || req.user.name || "",
      producerLocation: producerLocation || "",
    });

    return res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const listProducts = async (_req, res) => {
  try {
    const products = await Product.find({ isApproved: true }).sort({
      createdAt: -1,
    });
    return res.json({ message: "OK", products });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    // If not approved, only allow producer or admin to view
    if (!product.isApproved) {
      const isAuthenticated = Boolean(req.user);
      const isOwner =
        isAuthenticated && String(product.producer) === String(req.user._id);
      const isAdmin = isAuthenticated && req.user.role === "admin";
      if (!isOwner && !isAdmin) {
        return res.status(404).json({ message: "Product not found" });
      }
    }
    return res.json({ message: "OK", product });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const listMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ producer: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json({ message: "OK", products });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      producer: req.user._id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, description, price, category, quantity, producerLocation } =
      req.body;

    // TODO: MIGRATION TO AWS S3
    // Current implementation uses Cloudinary (temporary)
    // Future implementation will use AWS S3:
    /*
    if (req.file) {
      // Delete old image from S3
      if (product.imagePublicId) {
        try {
          await deleteImage(product.imagePublicId);
        } catch (_) {}
      }
      
      // Upload new image to S3
      const imageKey = generateImageKey(req.file.originalname, product._id.toString());
      const uploadResult = await uploadImage(req.file.buffer, imageKey, req.file.mimetype);
      product.imageUrl = uploadResult.url;
      product.imagePublicId = uploadResult.key;
    }
    */

    // CURRENT CLOUDINARY IMPLEMENTATION (TEMPORARY)
    if (req.file) {
      if (product.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(product.imagePublicId);
        } catch (_) {}
      }
      const uploadFromBuffer = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "indicrafts/products", resource_type: "image" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(buffer);
        });
      const uploadResult = await uploadFromBuffer(req.file.buffer);
      product.imageUrl = uploadResult.secure_url;
      product.imagePublicId = uploadResult.public_id;
    }

    const hasContentChange =
      name !== undefined ||
      description !== undefined ||
      price !== undefined ||
      category !== undefined ||
      quantity !== undefined ||
      producerLocation !== undefined ||
      Boolean(req.file);

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (quantity !== undefined) product.quantity = quantity;
    if (producerLocation !== undefined)
      product.producerLocation = producerLocation;

    // Any producer edits reset approval
    if (hasContentChange) {
      product.isApproved = false;
      product.approvalStatus = "pending";
      product.approvalNotes = undefined;
      product.approvedAt = undefined;
      product.approvedBy = undefined;
    }

    await product.save();
    return res.json({ message: "Product updated", product });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      producer: req.user._id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // TODO: MIGRATION TO AWS S3
    // Current implementation uses Cloudinary (temporary)
    // Future implementation will use AWS S3:
    /*
    if (product.imagePublicId) {
      try {
        await deleteImage(product.imagePublicId);
      } catch (_) {}
    }
    */

    // CURRENT CLOUDINARY IMPLEMENTATION (TEMPORARY)
    if (product.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch (_) {}
    }

    await product.deleteOne();
    return res.json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  listProducts,
  getProductById,
  listMyProducts,
  updateProduct,
  deleteProduct,
};
