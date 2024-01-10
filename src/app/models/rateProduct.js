
const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const RateProduct = new Schema(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        useful: { type: Schema.Types.Number, required: true, default: 0 },
        comment: { type: Schema.Types.String, required: true },
        email: { type: Schema.Types.String, required: true },
        isPurchased: { type: Schema.Types.Boolean, required: true },
        username: { type: Schema.Types.String, required: true },
        vote: { type: Schema.Types.Number, required: true },
        report: { type: Schema.Types.Number, required: true, default: 0 },
        createdAt: { type: Schema.Types.Date, required: true, default: new Date() },
    },
);

module.exports = mongoose.model("RateProduct", RateProduct, "coffee_rate_product");

