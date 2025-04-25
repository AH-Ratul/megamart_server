const appRouter = require("express").Router();
const userRouter = require("./userRouter/userRouter");
const productRouter = require("./productRouter/productRouter");
const cartRouter = require("./cartRouter/cartRouter");
const contactRouter = require("./contactRouter/contactRouter");

appRouter.use("/users", userRouter);
appRouter.use("/products", productRouter);
appRouter.use("/cart", cartRouter);
appRouter.use("/contact", contactRouter);

module.exports = appRouter;
