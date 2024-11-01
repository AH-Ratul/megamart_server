const productRouter = require("express").Router();
const productController = require("../../controllers/productController");

productRouter.post("/addProduct", productController.addProduct);

module.exports = productRouter;