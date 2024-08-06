const userRouter = require("express").Router();
const authController = require("../../controllers/authController");

userRouter.post("/signup", authController.signup);
userRouter.post('/login', authController.login);
userRouter.get("/get", authController.getUser);

module.exports = userRouter;

