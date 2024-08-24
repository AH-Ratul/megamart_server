const AppError = require("../utils/appError");

// HANDLE INVALID ID'S
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// HANDLE DUPLICATE FIELD VALUE
const handleDuplicateField = (err) => {
  const regex = /(["'])(\\?.)*?\1/;
  const value = err.errorResponse.errmsg.match(regex)[0];

  const message = `Duplicate value ${value}. please use another value.`;
  return new AppError(message, 400);
};

// HANDLE MONGOOSE VALIDATION ERROR
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `${errors.join(". ")}`;
  return new AppError(message, 400);
};

// HANDLE JWT ERROR
const handleJwtError = () =>
  new AppError("Invalid Token, Please login again", 401);

// HANDLE JWT TOKEN EXPIRES
const handleJWTEpiresError = () =>
  new AppError("Your Session is Expired. Please Login Again", 401);

// SEND ERROR DETAILS IN DEVELOPMENT
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// SEND VALID ERROR MESSAGE IN PRODUCTION
const sendErrorProd = (err, res) => {
  // Send trusted error message
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // send generic message, don't leak error details to user
  } else {
    console.error("Error 🔥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, __, res, ___) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    //let error = { ...err };
    err.message = err.message;

    if (err.name === "CastError") err = handleCastError(err);

    if (err.code === 11000) err = handleDuplicateField(err);

    if (err.name === "ValidationError") err = handleValidationError(err);

    if (err.name === "JsonWebTokenError") err = handleJwtError();

    if (err.name === "TokenExpiredError") err = handleJWTEpiresError();

    sendErrorProd(err, res);
  }
};
