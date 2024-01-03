const mongoose = require("mongoose");
const { generateRandomToken } = require("../../util/util");
const Schema = mongoose.Schema;

const account = new Schema(
  {
    username: { type: "string", default: "", required: true },
    password: { type: "string", default: "" },
    avatar: { type: "string", default: "https://bom.so/l6xbjc" },
    email: { type: "string", default: "" },
    phone: { type: "string", default: "" },
    address: [
      {
        homeAddress: { type: "string", default: "" },
        city: {
          code: { type: "number", default: 0 },
          name: { type: "string", default: "" }
        },
        district: {
          code: { type: "number", default: 0 },
          name: { type: "string", default: "" }
        },
        ward: {
          code: { type: Schema.Types.Number, default: 0 },
          name: { type: "string", default: "" }
        },
        defaultAddress: { type: Schema.Types.Boolean, default: false }
      }
    ],
    token: { type: "string", default: "" },
    cart: {
      items: [
        {
          productId: { type: "string", ref: "Product", required: true },
          sizeId: { type: "string", ref: "SizeProduct", required: true },
          quantity: { type: Schema.Types.Number, required: true },
        },
      ],
    },
    createdAt: { type: Schema.Types.Date, default: new Date().toLocaleString() },
    updatedAt: { type: Schema.Types.Date, default: new Date().toLocaleString() },
  },
);


module.exports = mongoose.model("Account", account, "coffee_account");
