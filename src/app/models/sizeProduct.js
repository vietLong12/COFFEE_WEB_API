const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SizeProduct = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
    }
);

module.exports = mongoose.model("SizeProduct", SizeProduct, "coffee_product_size");
