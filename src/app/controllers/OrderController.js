const Product = require("../models/product");
const Account = require("../models/account");
const Order = require("../models/order");
const nodemailer = require('nodemailer'); // khai báo sử dụng module nodemailer
const { sendEmail } = require("../../config/mail/mail")





// Hàm kiểm tra tính hợp lệ của một đối tượng
const checkObjectValid = (value, errorMsg) => {
  if (!value || value.length == 0) {
    throw {
      status: "error",
      code: 400,
      message: errorMsg,
    };
  }
};

class OrderController {
  // [POST] /orders/cart
  addToCart = async (req, res) => {
    const reqBody = req.body;
    const quantityReq = req.body.quantity || 1;

    try {
      // Kiểm tra tính hợp lệ của account, product và size
      const account = await Account.findById(reqBody.accountId);
      const product = await Product.findById(reqBody.productId);
      const size = product.sizes.filter(s => s._id == reqBody.sizeId);

      checkObjectValid(account, "Account not found");
      checkObjectValid(product, "Product not found");
      checkObjectValid(size, "Size not found");

      // Lấy giỏ hàng từ tài khoản
      let cart = [...account.cart.items];
      let isExist = false;

      // Cập nhật số lượng sản phẩm trong giỏ hàng
      cart = cart.map(item => {
        if (item.productId == product._id && item.sizeId == size[0]._id) {
          isExist = true;
          return { ...item, quantity: item.quantity + quantityReq };
        } else {
          return item;
        }
      });

      // Nếu sản phẩm chưa có trong giỏ hàng, thêm vào giỏ hàng
      if (!isExist) {
        cart.push({
          productId: product._id,
          sizeId: size[0]._id,
          quantity: quantityReq,
          note: reqBody.note || "Không có ghi chú"
        });
      }

      // Lọc các sản phẩm có số lượng > 0
      cart = cart.filter(item => item.quantity > 0);
      account.cart.items = cart;

      // Lưu tài khoản với giỏ hàng đã cập nhật
      const accountSaved = await account.save();

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
          account: {
            email: accountSaved.email,
            cart: accountSaved.cart
          },
          productName: product.productName,
          sizeName: size[0].name
        },
        timestamp: new Date().toLocaleString()
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        code: error.code,
        msg: error.message,
        timestamp: new Date().toLocaleString()
      });
    }
  }

  // [GET] /orders
  getListOrder = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5
    const keyword = req.query.keyword || ""
    const startIndex = (page - 1) * limit;
    const filter = {
      $or: [
        {
          $or: [
            { 'customer.username': { $regex: keyword, $options: 'i' } },
            { 'customer.address': { $regex: keyword, $options: 'i' } },
            { 'customer.email': { $regex: keyword, $options: 'i' } },
            { 'customer.phone': { $regex: keyword, $options: 'i' } }
          ]
        },
        { 'status': { $regex: keyword, $options: 'i' } },
        { 'paymentMethod': { $regex: keyword, $options: 'i' } },
        { 'orderNumber': { $regex: keyword, $options: 'i' } }
      ]
    };
    try {
      const data = await Order.find(filter).skip(startIndex).limit(limit).sort({ createdAt: -1 })

      const pageCount = await Order.countDocuments(filter);
      return res.json({
        status: 'success',
        code: 200,
        filter: keyword,
        orders: data,
        timeStamp: new Date(),
        pagination: {
          currentPage: data.length == 0 ? 1 : page,
          totalDocuments: pageCount,
          totalPages: Math.ceil(pageCount / limit) == 0 ? 1 : Math.ceil(pageCount / limit)
        }
      })
    } catch (error) {
      return res.status(error.code || 500).json({
        status: "error",
        code: error.code || 500,
        message: error.message || "Server internal error",
        timestamp: new Date().toLocaleString()
      })
    }
  }

  // [GET] /orders/:orderId
  getOrderById = async (req, res, next) => {
    const orderId = req.params.orderId
    const order = await Order.findById(orderId)
    if (order) {
      return res.status(200).json(
        {
          status: 'success',
          code: 200,
          order: order,
          timestamp: new Date().toLocaleString()
        })
    } else {
      return res.status(404).json(
        {
          status: 'not found',
          code: 404,
          order: order,
          timestamp: new Date().toLocaleString()
        })
    }
  }
  // [POST] /orders
  createOrder = async (req, res) => {
    try {
      const account = await Account.findById(req.body.accountId);
      if (!account) {
        return res.status(200).json({
          status: "error",
          code: 403,
          msg: "Account not found",
          timestamp: new Date().toLocaleString()
        });
      }
      if (account.cart.items.length < 1) {
        return res.status(200).json({
          status: "success",
          code: 200,
          msg: "Cart is empty",
          timestamp: new Date().toLocaleString()
        });
      }
      let totalAmount = 0;
      // Tạo một đơn hàng mới
      const order = new Order({
        customer: req.body.customer,
        items: await Promise.all(account.cart.items.map(async (item) => {
          const product = await Product.findById(item.productId);
          const size = product.sizes.find((s) => s._id == item.sizeId);
          let quantityReturn = item.quantity
          totalAmount += item.quantity * size.price
          // Trả về một đối tượng thể hiện thông tin sản phẩm trong đơn hàng
          return {
            productId: product._id,
            sizeId: size._id,
            quantity: quantityReturn,
            price: size.price,
            img: product.img
          };
        })),
        totalAmount: totalAmount,
        paymentMethod: req.body.paymentMethod,
        freightCost: req.body.freightCost
      });
      const savedOrder = await order.save();
      console.log('savedOrder: ', savedOrder);

      //setting mail
      const mainOptions = {
        from: 'Monster Coffee  <longnv.coffee.monster@gmail.com>',
        to: savedOrder.customer.email,
        subject: "Thông Báo: Đơn Hàng Mới Đã Đặt - #" + savedOrder.orderNumber,
        text: 'Cảm ơn ' + savedOrder.customer.username + ' đã đặt hàng tại Monster Coffee! Đơn hàng của bạn đã được xác nhận và đang được xử lý.',
        html: '<h3>Cảm ơn bạn đã đặt hàng tại Monster Coffee!</h3><h4>Đơn hàng của bạn đã được xác nhận và đang được xử lý. Dưới đây là chi tiết đơn hàng:</h4><ul style="font-size: 18px;"><li>Mã đơn hàng: #' + savedOrder.orderNumber + '</li><li>Ngày đặt hàng: ' + new Date().toLocaleString() + '</li><li>Tổng giá trị đơn hàng: ' + savedOrder.totalAmount + '.000đ </li></ul><h6>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được gửi đi. Cảm ơn bạn đã lựa chọn Monster Coffee!</h6>'
      };
      sendEmail(mainOptions)
      account.cart.items = [];
      await account.save();
      return res.json({ status: 'success', code: 200, desciption: "order created", order: savedOrder, timestamp: new Date().toLocaleString() });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        code: 500,
        msg: error.message,
        timestamp: new Date().toLocaleString()
      });
    }
  };

  // [PUT] /orders
  updateOrder = async (req, res, next) => {
    const statusOrder = req.body.statusOrder;
    const orderId = req.body.orderId;
    try {
      const order = await Order.findById(orderId);
      switch (statusOrder) {
        case "1":
          order.status = "Pending"
          break;
        case "2":
          order.status = "In progress"
          break;
        case "3":
          order.status = "Completed"
          break;
        case "4":
          order.status = "Cancel"
          break;
        default:
          throw {
            code: 400,
            message: "Status order not valid"
          }
      }
      if (!order) {
        throw {
          code: 404,
          message: 'Order not found'
        }
      }
      const orderSaved = await order.save()
      return res.status(200).json({
        status: 'success',
        code: 200,
        statusOrder: orderSaved.status,
        timestamp: new Date().toLocaleString()
      })
    } catch (error) {
      return res.status(error.code || 400).json({ status: "error", code: error.code || 400, msg: error.message, timestamp: new Date().toLocaleString() })
    }
  }
}

module.exports = new OrderController();
