const Product = require("../models/productModel");
const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/appError");

// ADD PRODUCT
exports.addProduct = tryCatch(async (req, res) => {
  const productData = req.body;

  const newProduct = new Product(productData);
  await newProduct.save();

  res
    .status(201)
    .json({ status: "success", message: "added", data: newProduct });
});
