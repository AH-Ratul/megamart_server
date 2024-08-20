const userRouter = require("express").Router();
const authController = require("../../controllers/authController");
const userController = require("../../controllers/userController");

userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);
userRouter.get("/get", authController.protect, userController.getUser);

module.exports = userRouter;
