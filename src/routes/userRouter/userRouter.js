const userRouter = require("express").Router();
const authController = require("../../controllers/authController");
const userController = require("../../controllers/userController");

userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);

userRouter.post("/forgetPassword", authController.forgetPassword);
userRouter.patch("/resetPassword/:token", authController.resetPassword);

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

userRouter.get("/get", authController.protect, userController.getUser);

userRouter
  .route("/get/:id")
  .get(authController.protect, userController.getUserById)
  .delete(
    authController.protect,
    authController.restrictedTo("admin"),
    userController.deleteUser
  );

module.exports = userRouter;
