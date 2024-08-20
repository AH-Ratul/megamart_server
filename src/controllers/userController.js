const User = require("../models/userModel");
const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/appError");

exports.getUser = tryCatch(async (__, res, next) => {
  const get = await User.find();

  if (!get) {
    next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    results: get.length,
    data: get,
  });
});

exports.getUserById = tryCatch(async (req, res, next) => {
  const getById = await User.findById(req.params.id);

  if (!getById) {
    return next(new AppError("User not found by this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: getById,
  });
});

exports.deleteUser = tryCatch(async (req, res, next) => {
  const delUser = await User.findByIdAndDelete(req.params.id);

  if (!delUser) {
    return next(new AppError("User not found by this ID to delete", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User deleted",
  });
});
