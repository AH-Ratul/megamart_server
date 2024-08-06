const express = require("express");
const cors = require("cors");

const appRouter = require("./routes/routes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

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
