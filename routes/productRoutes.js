const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ Get All Products (Fetch from DB)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});


// ✅ Add New Product
router.post("/", async (req, res) => {
  try {
    const { name, price, size, image, description } = req.body;
    const newProduct = new Product({ name, price, size, image, description });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "Error adding product" });
  }
});

module.exports = router;
