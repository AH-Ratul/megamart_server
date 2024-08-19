const AppError = require("../utils/appError");

const handleDuplicateField = (err) => {
  const regex = /(["'])(\\?.)*?\1/;
  const value = err.errorResponse.errmsg.match(regex)[0];
  console.log(value);

  const message = `Duplicate value ${value}. please use another value.`;
  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError("Invalid Token, Please login again", 401);

const handleJWTEpiresError = () =>
  new AppError("Your Session is Expired. Please Login Again", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
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
    let error = { ...err };
    error.message = err.message;

    if (error.errorResponse && error.errorResponse.code === 11000)
      error = handleDuplicateField(error);
    if (error.name === "JsonWebTokenError") error = handleJwtError(error);
    if (error.name === "TokenExpiredError") error = handleJWTEpiresError();

    sendErrorProd(error, res);
  }
};
