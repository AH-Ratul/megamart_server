const { Schema, default: mongoose } = require("mongoose");

const productSchema = new Schema({
  productName: {
    type: String,
    required: [true, "Must contains a Name"],
    unique: true,
  },
  productCode: { type: String },
  brand: { type: String },
  category: { type: String },
  subCategory: { type: String },
  description: { type: String },
  availability: { type: String },
  quantity: { type: Number },
  productImages: {
    type: [String],
    required: [true, "Product must contains a Image"],
  },
  price: {
    type: Number,
    required: [true, "Product must contains a price"],
  },
  discountPrice: { type: Number },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  reviews: [
    {
      user: {
        type: String,
        required: true,
      },
      comment: { type: String },
      rating: {
        type: Number,
        min: 0,
        max: 5,
      },
    },
  ],
  // details: {
  //   type: Map,
  //   of: Schema.Types.Mixed,
  //   required: true,
  // },
});

productSchema.add({
  details: {
    fashion: {
      brand: { type: String },
      material: { type: String },
      sizeGuide: { type: String },
      colorOption: { type: String },
      fit: { type: String },
    },
    books: {
      author: { type: String },
      publisher: { type: String },
      pages: { type: String },
      edition: { type: String },
      genre: { type: String },
    },
  },
});

const Product = mongoose.model("Products", productSchema);

module.exports = Product;
