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
    token: {
      type: "string", default: generateRandomToken()
    },
    cart: {
      items: [
        {
          productId: { type: "string", ref: "Product", required: true },
          sizeId: { type: "string", ref: "SizeProduct", required: true },
          quantity: { type: Schema.Types.Number, required: true },
        },
      ],
    },
    createdAt: { type: Schema.Types.Date, default: new Date() },
    updatedAt: { type: Schema.Types.Date, default: new Date() },
  },
  {
    timestamps: true,
  }
);

account.methods.addToCart = (product) => {
  console.log(this);
  const cartItems = [...this.cart.items];
  const productId = product.id;
  let isExist = false;
  for (let i = 0; i < cartItems.length; i++) {
    if (productId === cartItems[i]._id) {
      cartItems[i].quantity++;
      isExist = true;
    }
  }
  if (!isExist) {
    cartItems.push(product);
  }
  this.cart.items = cartItems;
  return this.save();
};

module.exports = mongoose.model("Account", account, "coffee_account");
