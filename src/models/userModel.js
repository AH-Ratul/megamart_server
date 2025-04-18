const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cartItemSchema = require("./cartModel");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please give a valid email."],
  },
  phone: {
    type: Number,
    required: [true, "Phone is required"],
    minLength: 11,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "Password must be at least 6 characters long."],
  },
  passwordConfirm: {
    type: String,
    validate: {
      // this only works on CREATE and SAVE
      validator: function (el) {
        return el === this.password; // abc == abc
      },
      message: "Password Doesn't Match.",
    },
  },
  passwordChangedAT: Date,
  passwordResetToken: String,
  passwordTokenExpires: Date,
  isCodeVerified: {
    type: Boolean,
    default: false,
  },
  cart: [cartItemSchema],
});

// hashing password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  //  deleting confirm password
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAT = Date.now() - 1000;
  next();
});

// method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAT) {
    const changeTimestamp = parseInt(
      this.passwordChangedAT.getTime() / 1000,
      10
    );

    //console.log(changeTimestamp, JWTTimestamp);
    return JWTTimestamp < changeTimestamp;
  }

  return false;
};

// METHODS FOR RESET TOKEN
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(2).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("users", userSchema);

module.exports = User;
