require('./config');
const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT;

// connected to MongoDB database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log("Database Error -> ", err);
  });

// start the server
app.listen(PORT, () => {
  console.log(`Server is Listening on Port ${PORT}`);
});

// handling uncaught expression
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UnCaughtException, Shutting down...");
  process.exit(1);
});

// handling unhandled rejection
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UnHandledRejection, Shutting down...");
  process.exit(1);
});
