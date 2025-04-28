const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const sslcz = require("../utils/sslCommerz");
const tryCatch = require("../utils/tryCatch");

//----------------------------- ORDER INITIATE ------------------------
exports.initiateOrder = tryCatch(async (req, res, next) => {
  const orderData = req.body;

  const order = new Order(orderData);

  await order.save();

  const data = {
    total_amount: orderData.totalPrice,
    currency: "BDT",
    tran_id: orderData.transactionId, // use unique tran_id for each api call
    success_url: `http://localhost:${process.env.PORT}/api/v1/order/success/${orderData.transactionId}`,
    fail_url: "http://localhost:2108/api/v1/order/fail",
    cancel_url: "http://localhost:2108/api/v1/order/cancel",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const response = await sslcz.init(data);

  // Redirect the user to payment gateway
  if (response.GatewayPageURL) {
    res.json({ redirectUrl: response.GatewayPageURL });
  } else {
    return next(new AppError("failed to initiate payment"));
  }
  console.log("Redirecting to: ", response.GatewayPageURL);
});

//------------------------- SUCCESS if PAY ----------------------------
exports.handleSuccess = tryCatch(async (req, res) => {
  const transactionId = req.params.transactionId;
  const order = await Order.findOneAndUpdate(
    { transactionId },
    { status: "SUCCESS" },
    { new: true }
  );

  if (!order) {
    res.status(404).json({ message: "Order not found" });
  }

  const updatePromises = order.products.map(async (item) => {
    const product = await Product.findById(item.productId);

    if (product) {
      const newQty = product.quantity - item.quantity;
      product.quantity = newQty >= 0 ? newQty : 0;

      if (product.quantity === 0) {
        product.availability = "Out of Stock";
      }
      await product.save();
    }
  });

  await Promise.all(updatePromises);

  res.redirect(`http://localhost:5173/order/success/${transactionId}`);
});
