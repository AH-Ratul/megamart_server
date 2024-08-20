const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/appError");


// MANAGE JWT TOKEN
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

//------------ SIGN UP ------------
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

//------------ LOG IN ------------
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
    return next(new AppError("Invalid Email or Password", 401));
  }

  // if all ok, send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    message: "Login Successfull",
  });
});

// ---------- TO PROTECT DATA -------------
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
    return next(new AppError("Your are not Logged in, Please Login", 401));
  }

  // verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        "The user belonging with this token is no longer exists",
        401
      )
    );
  }

  // check if user changed passowrd after token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("You recently changed password, Please login again", 401)
    );
  }

  // access to protected route
  req.user = freshUser;
  next();
});

