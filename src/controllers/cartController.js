const User = require("../models/userModel");
const tryCatch = require("../utils/tryCatch");

//------------------------ ADD TO CART --------------------------------
exports.addTocart = tryCatch(async (req, res) => {
  const userId = req.params.userId;
  const { productId, productName, productImages, price, quantity } = req.body;

  const user = await User.findById(userId);

  const existingItem = user.cart.find((item) =>
    item.productId.equals(productId)
  );

  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    user.cart.push({
      productId,
      productName,
      productImages,
      price,
      quantity,
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

exports.decreaseQuantity = tryCatch(async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  const user = User.findById(userId);

  const ifItem = user.find((item) => item.productId.equals(productId));

  if (ifItem) {
    if (ifItem.quantity > 1) {
      ifItem.quantity -= 1;
    }
  }

  res.status(200).json({ cart: user.cart });
});
