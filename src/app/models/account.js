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
          code: { type: "string", default: "" },
          name: { type: "string", default: "" }
        },
        district: {
          code: { type: "string", default: "" },
          name: { type: "string", default: "" }
        },
        ward: {
          code: { type: "string", default: "" },
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
          note: { type: Schema.Types.String, required: true, default: "Không có ghi chú" },
        }
      ],
    },
    verifyCode: { type: Schema.Types.String, default: "" },
    verifyCodeExpireAt: { type: Schema.Types.Date, default: Date.now },
    createdAt: { type: Schema.Types.Date, default: new Date().toLocaleString() },
    updatedAt: { type: Schema.Types.Date, default: new Date().toLocaleString() },
  },
);
account.pre('save', function (next) {
  // Thực hiện chỉ khi verifyCode thay đổi
  if (this.isModified('verifyCode')) {
    this.verifyCodeExpireAt = new Date(Date.now() + 30 * 1000); // Thời gian sống 2 phút
  }

  // Nếu verifyCodeExpireAt đã hết hạn, đặt lại verifyCode về ""
  if (this.verifyCodeExpireAt < new Date()) {
    this.verifyCode = "";
  }

  next();
});
module.exports = mongoose.model("Account", account, "coffee_account");
