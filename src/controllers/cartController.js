const User = require("../models/userModel");
const AppError = require("../utils/appError");
const tryCatch = require("../utils/tryCatch");

//------------------------ ADD TO CART --------------------------------
exports.addTocart = tryCatch(async (req, res, next) => {
  const userId = req.params.userId;
  const {
    productId,
    productName,
    productImages,
    price,
    discountPrice,
    quantity,
  } = req.body;

  const user = await User.findById(userId);

  const existingItem = user.cart.find((item) =>
    item.productId.equals(productId)
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    user.cart.push({
      productId,
      productName,
      productImages,
      price,
      discountPrice,
      quantity:1,
    });
  }

  await user.save();

  res.status(200).json({ message: "Cart updated", cart: user.cart });
});

//-------------------- GET CART -------------------------
exports.getCart = tryCatch(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId).populate("cart");

  res.status(200).json(user.cart);
});

//------------------------ REMOVE FROM CART ----------------------
exports.removeItem = tryCatch(async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  await User.findByIdAndUpdate(userId, {
    $pull: { cart: { productId } },
  });

  res.status(200).json({ message: "Item removed from cart" });
});

//------------------------ DECREASE QUANTITY ----------------------------
exports.decreaseQuantity = tryCatch(async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  const user = await User.findById(userId);

  const hasItem = user.cart.find((item) => item.productId.equals(productId));

  if (hasItem) {
    if (hasItem.quantity > 1) {
      hasItem.quantity -= 1;
      await user.save();
    }
  }

  res.status(200).json({ cart: user.cart });
});
