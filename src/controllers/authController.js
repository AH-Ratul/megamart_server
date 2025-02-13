const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

// MANAGE JWT TOKEN
const signToken = (id, email, role) => {
  return jwt.sign(
    { id: id, email: email, role: role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.EXPIRES_IN,
    }
  );
};

// MANAGE TOKEN WITH COOKIES
const createSendToken = (user, statusCode, message, res) => {
  const token = signToken(user._id, user.email, user.role);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "none",
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("token", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: {
      user,
    },
  });
};

//------------ SIGN UP ------------
exports.signup = tryCatch(async (req, res, next) => {
  const existsUser = await User.findOne({ email: req.body.email });

  if (existsUser) {
    return next(new AppError("The email already exists", 400));
  }

  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, "User Created", res);
});

//------------ LOG IN ------------
exports.login = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please Provide Email & Password", 400));
  }

  // check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Invalid Email or Password", 401));
  }

  // If it's an admin request, then check the user's role
  if (req.body.isAdmin && user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Unauthorized: Admin access required" });
  }

  // if all ok, send token to client
  createSendToken(user, 200, "Login Successfull", res);
});

// ----------- LOG OUT -------------------
exports.logout = (req, res) => {
  const cookieOptions = {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "none",
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("token", "", cookieOptions);

  res.status(200).json({
    status: "success",
    message: "Your are Logged Out!",
  });
};

// ---------- TO PROTECT DATA -------------
exports.protect = tryCatch(async (req, res, next) => {
  // getting token and check of it's here
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError("Your are not Logged in, Please Login", 401));
  }

  // verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  const freshUser = await User.findOne({ email: decoded.email });
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

//----------- RESTRICTED TO ADMIN -------------
exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

// --------- FORGET PASSWORD ------------
exports.forgetPassword = tryCatch(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no User with this email", 404));
  }

  // Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send to user's email
  const message = `Forget your password?\n Submit this code ${resetToken}.\n Which is validate for 10 minutes. \nIf your didn't forget your password. please ignore this.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token(validate for 10 minutes).",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Code Sent to Your Email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error to sending Email, Please try again!",
        500
      )
    );
  }
});

// --------------- VERIFY RESET CODE ------------
exports.verifyCode = tryCatch(async (req, res, next) => {
  // Get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.code)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordTokenExpires: { $gt: Date.now() },
  });

  // If token has not expoired, and there is user, verify
  if (!user) {
    return next(new AppError("Code is invalid or expired", 400));
  }

  user.passwordResetToken = undefined;
  user.passwordTokenExpires = undefined;
  user.isCodeVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Code Verified Successfully",
    email: user.email,
  });
});

//---------------- RESET PASSWORD ----------------
exports.resetPassword = tryCatch(async (req, res, next) => {
  const email = req.body.email;

  const user = await User.findOne({
    email,
    isCodeVerified: true,
  });

  if (!user) {
    return next(
      new AppError("Invalid request. Please verify the code first!", 400)
    );
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError("Password doesn't Match", 400));
  }

  user.password = req.body.password;
  user.isCodeVerified = false;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password Successfully Reset!",
  });
});

//------------------ UPDATE PASSWORD ---------------
exports.updatePassword = tryCatch(async (req, res, next) => {
  // get user
  const user = await User.findById(req.user.id).select("+password");

  // check if given current password is correct
  if (!(await user.comparePassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong!", 401));
  }

  //if correct, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // loged user in, send token
  createSendToken(user, 200, "Your password is updated", res);
});
