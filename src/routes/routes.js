const appRouter = require("express").Router();
const userRouter = require("./userRouter/userRouter");
const productRouter = require("./productRouter/productRouter");
const cartRouter = require("./cartRouter/cartRouter");

appRouter.use("/users", userRouter);
appRouter.use("/products", productRouter);
appRouter.use("/cart", cartRouter);

module.exports = appRouter;
