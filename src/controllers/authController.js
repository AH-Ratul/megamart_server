const { promisify } = require("util");
const User = require("../models/userModel");
const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

exports.signup = tryCatch(async (req, res) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    message: "User Created",
    data: {
      user: newUser,
    },
  });
});

exports.login = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please Provide Email & Password", 400));
  }

  // check if user exists and password is correct
  const user = await User.findOne({ email });
  const isMatch = await user.comparePassword(password);

  if (!user || !isMatch) {
    return next(new AppError("Invalid email and password", 401));
  }

  // if all ok, send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    message: "Login Successfull",
  });
});

exports.protect = tryCatch(async (req, res, next) => {
  // getting token and check of it's here
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    next(new AppError("Your are not Logged in, Please Login.", 401));
  }

  // verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    next(
      new AppError(
        "The user belonging with this token is no longer exists",
        401
      )
    ); 
  }

  next();
});

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
