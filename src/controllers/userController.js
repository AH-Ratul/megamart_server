const User = require("../models/userModel");
const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFileds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFileds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//------------- GET USER ---------------------
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

//-------------- GET USER BY ID ----------------
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

//------------ UPDATE USER ---------------
exports.updateUser = tryCatch(async (req, res, next) => {
  // create error if user post password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "Password is not allow for update here, Please go to Update password",
        400
      )
    );
  }

  // filter out which fileds are to be updated
  const filteredBody = filterObj(req.body, "name", "email", "phone");

  // update user documents
  const update = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "User successfully updated",
    data: update,
  });
});

//------------ DELETE USER ----------------
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
