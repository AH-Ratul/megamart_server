const handleDuplicateField = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    console.log(value)
    const message = `Duplicate Field value ${value}. please use another value.`;
  }
  
  const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  };
  
  // const sendErrorProd = (err, res) => {
  //   // Operational , trusted error: send message to client
  //   if (err.isOperational) {
  //     res.status(err.statusCode).json({
  //       status: err.status,
  //       message: err.message,
  //     });
  
  //     // programming or other unknown errors
  //   } else {
  //     // log error
  //     console.error('Error 🔥',err)
  
  //     // send generic message
  //     res.status(500).json({
  //       status: "error",
  //       message: "something went very wrong!!",
  //     });
  //   }
  // };
  
  module.exports = (err, __, res, ___) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Internal Server Error";
  
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  
    // if (process.env.NODE_ENV === "development") {
    //   sendErrorDev(err, res);
    // } else if (process.env.NODE_ENV === "production") {
    //   let error = {...err};
  
    //   if(error.code === 11000) error = handleDuplicateField(error);
    //   sendErrorProd(error, res);
    // }
  };
  