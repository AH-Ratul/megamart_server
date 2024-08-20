const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
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
    minLength: 6,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Confirm your Password"],
    minLength: 6,
    validate: {
      // this only works on CREATE and SAVE
      validator: function (el) {
        return el === this.password; // abc == abc
      },
      message: "Passwords are not same.",
    },
  },
  passwordChangedAT: Date,
  passwordResetToken: String,
  passwordTokenExpires: Date,
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

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(2).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("users", userSchema);

module.exports = User;
