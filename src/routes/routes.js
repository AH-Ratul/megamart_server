const appRouter = require("express").Router();
const userRouter = require("./userRouter/userRouter");
const productRouter = require("./productRouter/productRouter");
const cartRouter = require("./cartRouter/cartRouter");
const contactRouter = require("./contactRouter/contactRouter");
const orderRouter = require("./orderRouter/orderRouter");

appRouter.use("/users", userRouter);
appRouter.use("/products", productRouter);
appRouter.use("/cart", cartRouter);
appRouter.use("/contact", contactRouter);
appRouter.use("/order", orderRouter);

module.exports = appRouter;
