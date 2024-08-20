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
