const { default: mongoose } = require("mongoose");

const addressSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  orderNote: String,
});

module.exports = addressSchema;
