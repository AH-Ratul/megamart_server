const productRouter = require("express").Router();
const productController = require("../../controllers/productController");

productRouter.post("/addProduct", productController.addProduct);
productRouter.get("/getProducts", productController.getProduct);
productRouter.get("/getProducts/:id", productController.getProductByID);
productRouter.get("/search", productController.searchProduct);

module.exports = productRouter;
