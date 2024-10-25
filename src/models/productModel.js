const { Schema } = require("mongoose");

const productSchema = new Schema({
    productName: {
        type: String,
        required: [true, "Must contains a Name"],
        unique: true
    },
    brand: {
        type: String
    },
    category: {
        type: String
    },
    description: {
        type: String
    },
    productImage: {
        type: [String],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number
    },
    

})