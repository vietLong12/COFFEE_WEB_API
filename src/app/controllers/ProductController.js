const Product = require("../models/product");
const Order = require("../models/order");
const CategoryProduct = require("../models/categoryProduct");
const RateProduct = require("../models/rateProduct");
const { isValidObjectId } = require("mongoose");

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
    CategoryProduct.find().then((data) => {
      if (data) return res.status(200).json({ data: data, record_size: data.length })
    })
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
    // const rateProductReq = req.body
    // try {
    //   const order = Order.find({ em: })
    //   const rateProduct = new RateProduct()
    //   Object.assign(rateProduct, rateProductReq)
    //   const rateProductSaved = await rateProduct.save()
    //   return res.json({ status: 'success', code: 200, data: rateProductSaved, timestamp: new Date().toLocaleString() })
    // } catch (error) {
    return res.status(400).json({ status: 'error', code: 400, data: "dang phat trien", timestamp: new Date().toLocaleString() })
  }






  handleImage = async (req, res) => {
    console.log(req.file)
  }



}

module.exports = new ProductController();
