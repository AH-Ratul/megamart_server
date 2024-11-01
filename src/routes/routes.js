const appRouter = require("express").Router();
const userRouter = require("./userRouter/userRouter");
const productRouter = require("./productRouter/productRouter");

appRouter.use("/users", userRouter);
appRouter.use("/products", productRouter);

module.exports = appRouter;
