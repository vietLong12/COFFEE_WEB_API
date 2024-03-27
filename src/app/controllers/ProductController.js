const Product = require("../models/product");
const Order = require("../models/order");
const Account = require("../models/account");
const CategoryProduct = require("../models/categoryProduct");
const RateProduct = require("../models/rateProduct");
const { isValidObjectId } = require("mongoose");
const cloudinary = require("cloudinary");

class ProductController {
  // [GET] /products
  async listProduct(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const depth = parseInt(req.query.depth) || 1;
    const limit = parseInt(req.query.limit) || 5
    const keyword = req.query.keyword || ""
    const startIndex = (page - 1) * limit;
    const filter = {
      $or: [
        { productName: { $regex: keyword, $options: 'i' } },
        { "sizes.name": { $regex: keyword, $options: 'i' } },
        { categoryId: { $regex: keyword, $options: 'i' } },
      ],
    };
    let data = await Product.find(filter).skip(startIndex).limit(limit)
    if (depth === 1) {
      data = data.map((product) => {
        return {
          _id: product._id,
          productName: product.productName,
          categoryId: product.categoryId
        }
      })
    }
    if (depth === 2) {
      data = data.map((product) => {
        return {
          _id: product._id,
          productName: product.productName,
          sizes: product.sizes,
          img: product.img,
          desc: product.desc,
          categoryId: product.categoryId
        }
      })
    }
    const pageCount = await Product.countDocuments(filter);
    res.json({
      status: 'success',
      code: 200,
      products: data,
      timeStamp: new Date().toLocaleString(),
      pagination: {
        currentPage: data.length == 0 ? 1 : page,
        totalDocuments: pageCount,
        totalPages: Math.ceil(pageCount / limit)
      }
    })
  }


  //[GET] /products/:id
  getProductById = async (req, res) => {
    const product_id = req.params.id;
    if (isValidObjectId(product_id)) {
      const product = await Product.findById(product_id)
      if (product) {
        return res.status(200).json({ status: "success", code: 200, product: product, timestamp: new Date().toLocaleString() });
      } else {
        return res.status(404).json({ status: "error", code: 404, product: "Product not found", timestamp: new Date().toLocaleString() });
      }
    } else {
      return res.status(400).json({ status: "error", code: 400, msg: "Product id not valid", timestamp: new Date().toLocaleString(), });
    }
  };

  // [POST] /products
  async createProduct(req, res) {
    const productReq = req.body;
    const categoryId = req.body.categoryId;
    try {
      const category = await CategoryProduct.findById(categoryId)
      if (category) {
        const product = new Product(productReq);
        const productSaved = await product.save();
        return res.status(200).json({
          status: "Success",
          code: 200,
          product: {
            productName: productSaved.productName,
            img: productSaved.img,
            description: productSaved.desc,
            category: category.category,
            sizes: productSaved.sizes
          },
          timeStamp: new Date().toLocaleString()
        });
      } else {
        throw {
          code: 400,
          message: "Category id not found"
        }
      }
    } catch (error) {
      return res.status(error.code).json({
        status: "error",
        code: error.code,
        msg: error.message,
        timeStamp: new Date().toLocaleString(),
      })
    }
  }


  // [PUT] /products
  editProduct = async (req, res) => {
    const productReq = req.body;
    productReq.updatedAt = new Date();
    try {
      const product = await Product.findById(productReq.productId);
      const oldProduct = { ...product._doc }
      if (product) {
        const productUpdate = Object.assign(product, productReq);
        const productSaved = await productUpdate.save();
        return res.json({ status: 'success', code: 200, product: productSaved, oldProduct: oldProduct, timestamp: new Date().toLocaleString() });
      } else {
        throw {
          code: 404,
          message: 'Product not found'
        }
      }
    } catch (error) {
      return res.status(error.code).json({ status: "error", code: error.code, message: error.message, timestamp: new Date().toLocaleString() });
    }
  };

  //[DELETE] /products/:id
  deleteProduct = (req, res) => {
    const productId = req.params.productId;
    Product.findByIdAndDelete(productId)
      .then((result) => {
        if (result != null) {
          res.status(200);
          res.json({
            status: "success",
            code: 200,
            message: "Product deleted",
            dataRemoved: result,
            timestamp: new Date().toLocaleString(),
          });
        } else {
          return res.status(404).json({ status: "error", code: 404, msg: "Product not found", timestamp: new Date().toLocaleString() })
        }
      })
      .catch((err) => {
        res.status(404);
        res.json({ message: err.message, createdAt: new Date() });
      });


  };

  createCategory = (req, res) => {
    if (req.body.category) {
      const categoryReq = req.body.category.toLowerCase();
      CategoryProduct.findOne({ category: categoryReq }).then((data) => {
        if (data) return res.status(400).json({ message: "Category is exits", createdAt: new Date() })
        else {
          const categorySaved = new CategoryProduct({ category: categoryReq }).save().then((data) => {
            return res.status(200).json(data)
          }
          )
        }
      })
    }
    else {
      return res.status(400).json({ message: "Category id invalid", createdAt: new Date() })
    }
  };

  getCategoryList = (req, res) => {
    try {
      CategoryProduct.find().then((data) => {
        if (data) return res.status(200).json({ data: data, record_size: data.length });
      }).catch((err) => {
        throw { 
          code: 500,
          message: err.message
        };
      });
    } catch (error) {
      return res.status(error.code || 500).json({ message: error.message || "Internal Server Error", createdAt: new Date() });
    }
  }


  deleteCategoryById = (req, res) => {
    const categoryId = req.body.categoryId
    if (isValidObjectId(categoryId)) {
      CategoryProduct.findById(categoryId).then((data) => {
        return res.status(200).json({ message: "Deleted category", createdAt: new Date(), dataRemoved: data })
      }).catch((err) => {
        return res.status(400).json({ message: err.message, createdAt: new Date(), dataRemoved: null })
      })
    } else {
      return res.status(400).json({ message: "Request invalid", createdAt: new Date(), dataRemoved: null })
    }
  }

  commentProduct = async (req, res) => {
    const rateProductReq = req.body
    try {
      const product = await Product.findById(rateProductReq.productId)
      const order = await Order.findOne({ 'customer.email': rateProductReq.email })
      const rateProduct = new RateProduct()
      Object.assign(rateProduct, rateProductReq)
      if (order) {
        rateProduct.isPurchased = true
      } else {
        rateProduct.isPurchased = false
      }
      const rateProductSaved = await rateProduct.save()
      product.comments.push(rateProductSaved._id)
      product.save()
      return res.json({ status: 'success', code: 200, data: rateProductSaved, timestamp: new Date().toLocaleString() })

    } catch (error) {
      return res.status(400).json({ status: 'error', code: 400, msg: error.message, timestamp: new Date().toLocaleString() })
    }
  }

  getCommentProduct = async (req, res) => {
    const vote = req.query.vote || ""
    const productId = req.params.productId
    const product = await Product.findById(productId)
    if (product) {
      let listComment = product?.comments
      if (!listComment) {
        return res.status(400).json({ status: 'error', code: 400, msg: "not found comment", timestamp: new Date().toLocaleString() })
      }
      const listResult = listComment.map(async comment => {
        const cmtInfor = await RateProduct.findById(comment)
        return cmtInfor
      })
      let comments = await Promise.all(listResult)
      if (vote != "") {
        comments = comments.filter(r => r.vote === vote)
      }
      const totalVotes = comments.reduce((accumulator, currentValue) => accumulator + currentValue.vote, 0);
      const averageVote = totalVotes / comments.length;


      return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
          listComment: comments,
          averageVote: averageVote
        },
        timestamp: new Date().toLocaleString(),
      })
    } else {
      return res.status(404).json({ status: 'error', code: 404, msg: "product not found", timestamp: new Date().toLocaleString() })

    }
  }










}

module.exports = new ProductController();
