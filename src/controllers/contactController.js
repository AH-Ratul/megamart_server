const User = require("../models/userModel");
const tryCatch = require("../utils/tryCatch");

exports.addContact = tryCatch(async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  const user = await User.findById(userId);

  if (user) {
    user.addresses.push(data);
    await user.save();
    res.status(200).json({ address: user.addresses });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
