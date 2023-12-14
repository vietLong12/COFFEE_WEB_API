const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SizeProduct = new Schema(
    {
        categoryId: { type: Schema.Types.String, ref: "CategoryProduct", required: true },
        size: { type: Schema.Types.String, required: true },
        createdAt: { type: Schema.Types.Date, required: true, default: new Date() },
        updatedAt: { type: Schema.Types.Date, required: true, default: new Date() },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SizeProduct", SizeProduct, "coffee_product_size");
