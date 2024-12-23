const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const appRouter = require("./routes/routes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

//GLOBAL MIDDLEWARES
app.use(helmet());

const limiter = rateLimit({
  max: 1000,
  windowMs: 10 * 60 * 1000,
  message: "Too many request from this IP, please try again in 1 hour.",
});

app.use(limiter);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieparser());

// Data sanitize against NOSQL query injection
app.use(mongoSanitize());

// TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.cookies);

  next();
});

// api router
app.use("/api/v1", appRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server.`,
  });
});

app.use(globalErrorHandler);

module.exports = app;
