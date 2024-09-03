const userRouter = require("express").Router();
const authController = require("../../controllers/authController");
const userController = require("../../controllers/userController");

userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);
userRouter.post("/logout", authController.logout);

userRouter.post("/forgetPassword", authController.forgetPassword);
userRouter.post("/verifyCode", authController.verifyCode);
userRouter.patch("/resetPassword", authController.resetPassword);

userRouter.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

userRouter.patch(
  "/updateUser",
  authController.protect,
  userController.updateUser
);

userRouter.get("/getAll", authController.protect, userController.getUser);
userRouter.get("/getMe", authController.protect, userController.getMe);

userRouter
  .route("/get/:id")
  .get(authController.protect, userController.getUserById)
  .delete(
    authController.protect,
    authController.restrictedTo("admin"),
    userController.deleteUser
  );

module.exports = userRouter;
