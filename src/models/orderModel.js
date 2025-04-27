const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "users" },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: { type: Number, required: true },
  transactionId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED", "CANCELLED"],
    default: "PENDING",
  },
  payAT: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Orders", orderSchema);

module.exports = Order;
