const Product = require("../models/product");
const Account = require("../models/account");
const SizeProduct = require("../models/sizeProduct");
const { isValidObjectId } = require("mongoose");

class OrderController {
  // [POST] /cart
  addToCart = async (req, res) => {
    const {
      accountId,
      productId,
      sizeId,
      quantity
    } = req.body;
    try {
      if (isValidObjectId(accountId) && isValidObjectId(productId) && isValidObjectId(sizeId)) {
        const account = await Account.findById(accountId);
        const product = await Product.findById(productId);
        const size = await SizeProduct.findById(sizeId);
        if (account != null && size != null && product != null) {
          if (product.categoryId == size.categoryId) {
            let isNew = true;
            let listCartItems = [...account.cart.items].map((item) => {
              if (item.productId == productId && item.sizeId == sizeId) {
                isNew = false
                if (quantity != null) {
                  item.quantity += quantity
                } else {
                  item.quantity++;
                }
              }
              return item
            })
            if (isNew) {
              console.log("is New true")
              listCartItems.push({ productId: productId, quantity: quantity ? quantity : 1, sizeId: sizeId })
            }
            account.cart.items = listCartItems
            const accountSaved = await account.save()
            return res.status(200).json({
              message: "Save account successfully",
              accountSaved: accountSaved,
              createdAt: new Date(),
            })
          }
          else {
            throw new Error("Product and size invalid")
          }
        } else {
          throw new Error("Not found data")
        }
      } else {
        throw new Error("Request invalid")
      }
    }
    catch (error) {
      return res.status(400).json({
        message: error.message,
        createdAt: new Date(),
      })
    }

  };
}

module.exports = new OrderController();
