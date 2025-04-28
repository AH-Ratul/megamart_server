const Product = require("../models/productModel");
const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/appError");

//---------------- ADD PRODUCT ---------------------
exports.addProduct = tryCatch(async (req, res) => {
  const productData = req.body;

  const newProduct = await Product.create(productData);

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

//------------------ GET PRODUCT BY ID -------------
exports.getProductByID = tryCatch(async (req, res) => {
  const getById = await Product.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: getById,
  });
});

//------------------------ SEARCH PRODUCTS ----------------------
exports.searchProduct = tryCatch(async (req, res) => {
  const keyword = req.query.keyword;
  const regex = new RegExp(keyword, "i"); // case insensitive

  const products = await Product.find({ productName: regex });

  res.status(200).json(products);
});
