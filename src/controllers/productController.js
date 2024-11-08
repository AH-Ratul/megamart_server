const Product = require("../models/productModel");
const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/appError");

//---------------- ADD PRODUCT ---------------------
exports.addProduct = tryCatch(async (req, res) => {
  const productData = req.body;

  const newProduct = new Product(productData);
  await newProduct.save();

  res
    .status(201)
    .json({ status: "success", message: "added", data: newProduct });
});

//---------------- GET PRODUCT----------------------
exports.getProduct = tryCatch(async (req, res) => {
  const getProducts = await Product.find();

  res.status(200).json({
    status: "success",
    results: getProducts.length,
    data: getProducts,
  });
});
