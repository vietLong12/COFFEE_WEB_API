const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategoryProduct = new Schema(
	{

		category: { type: Schema.Types.String, required: true },
		createdAt: { type: Schema.Types.Date, required: true, default: new Date() },

		updatedAt: { type: Schema.Types.Date, required: true, default: new Date() },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("CategoryProduct", CategoryProduct, "coffee_category_product");

