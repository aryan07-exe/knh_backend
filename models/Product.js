const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  description: { type: String, required: true }, // ✅ Added description
  image: { type: String, required: true },
});

module.exports = mongoose.model("Product", ProductSchema);
