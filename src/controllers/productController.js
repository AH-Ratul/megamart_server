const Product = require("../models/productModel");
const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/appError");

// ADD PRODUCT
exports.addProduct = tryCatch(async (req, res) => {
  const productData = req.body;

  
});
