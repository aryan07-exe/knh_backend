const express = require("express");
const Product = require("../models/Product");
const upload = require("../middleware/multermiddleware"); // Import multer middleware

const router = express.Router();

// ✅ Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// ✅ Add New Product with Image Upload Middleware
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, size} = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const newProduct = new Product({
      name,
      price,
      size,
      image: imagePath, // Store image path in DB
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "Error adding product", error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
          return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error deleting product", error });
  }
});

module.exports = router;