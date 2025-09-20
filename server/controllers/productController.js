const Product = require("../models/Product");
const { cloudinary } = require("../services/cloudinary");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, producerLocation } =
      req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload from memory buffer using upload_stream
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
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.json({ message: "OK", products });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
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

    // If new image uploaded, replace on Cloudinary
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

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (quantity !== undefined) product.quantity = quantity;
    if (producerLocation !== undefined)
      product.producerLocation = producerLocation;

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
