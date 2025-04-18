const cartRouter = require("express").Router();
const cartController = require("../../controllers/cartController");

cartRouter.post("/addToCart/:userId", cartController.addTocart);
cartRouter.get("/getCart/:userId", cartController.getCart);
cartRouter.delete(
  "/removeFromCart/:userId/:productId",
  cartController.removeItem
);

module.exports = cartRouter;
