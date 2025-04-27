const orderRouter = require("express").Router();
const orderController = require("../../controllers/orderController");

orderRouter.post("/initiateOrder", orderController.initiateOrder);
orderRouter.post("/success/:transactionId", orderController.handleSuccess);

module.exports = orderRouter;
