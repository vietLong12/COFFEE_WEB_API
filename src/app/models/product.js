const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Product = new Schema(
  {
    productName: { type: "string", required: true },
    price: { type: Schema.Types.Number, required: true },
    img: { type: Schema.Types.String, required: true, default: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp" },
    desc: {
      type: Schema.Types.String,
      default: "Không có mô tả",
    },
    quantity: { type: Schema.Types.Number, required: true, default: 1 },
    rating: { type: Schema.Types.Number, required: true, default: 5 },
    inStock: { type: Schema.Types.Boolean, default: true },
    categoryId: { type: Schema.Types.String, ref: "CategoryProduct", required: true },
    createdAt: { type: Schema.Types.Date, required: true, default: new Date() },
    updatedAt: { type: Schema.Types.Date, required: true, default: new Date() },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", Product, "coffee_product");

