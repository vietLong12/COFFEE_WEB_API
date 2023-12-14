const Product = require("../models/product");
const CategoryProduct = require("../models/categoryProduct");
const SizeProduct = require("../models/sizeProduct");
const { isValidObjectId } = require("mongoose");

class ProductController {
  // [GET] /products
  async listProduct(req, res, next) {
    try {
      const data = await Product.find();

      const result = await Promise.all(
        data.map(async (product) => {
          const sizeProduct = await SizeProduct.find({ categoryId: product._doc.categoryId });
          const sizeResult = []
          sizeProduct.map((item) => {
            sizeResult.push(item.size)
          })
          return { ...product._doc, size: sizeResult };
        })
      );

      return res.status(200).json({ data: result, recordSize: data.length });
    } catch (error) {
      // Handle errors appropriately
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  //[GET] /products/:id
  getProductById = (req, res) => {
    const product_id = req.params.id;
    if (isValidObjectId(product_id)) {
      Product.findById(product_id)
        .then(async (product) => {
          const listSize = await SizeProduct.find({ categoryId: product.categoryId })
          return res.status(200).json({ data: { ...product._doc, size: listSize.map((item) => item.size) }, createdAt: new Date() });

        })
        .catch((error) => {
          res.status(400);
          res.json({
            message: error.message,
            createdAt: new Date(),
          });
        });
    } else {
      return res.status(400).json({ message: "Request invalid", createdAt: new Date() });
    }
  };

  // [POST] /products
  createProduct(req, res) {
    const productReq = req.body;
    if (
      !productReq.productName ||
      !productReq.price ||
      !productReq.categoryId || req.body._id
    ) {
      return res.status(400).json({ message: "Request invalid", createdAt: new Date() });
    }
    const product = new Product(productReq);
    product.save().then((data) => {
      return res.status(200).json({
        message: "Product saved successfully",
        createdAt: new Date(),
        data: data
      });
    })
  }


  // [PUT] /products
  editProduct = (req, res) => {
    const productReq = req.body;
    console.log('productReq: ', req.body);
    if (isValidObjectId(productReq.id)) {
      Product.findById(productReq.id)
        .then((product) => {
          product.productName = productReq.productName ? productReq.productName : product.productName;
          product.price = productReq.price ? productReq.price : product.price;
          product.img = productReq.img ? productReq.img : product.img;
          product.desc = productReq.desc ? productReq.desc : product.desc;
          product.quantity = productReq.quantity
            ? productReq.quantity
            : product.quantity;
          product.isStock = productReq.quantity > 0;
          product.updatedAt = new Date()
          product.save().then((data) => res.status(200).json({ message: "Updated product", createdAt: new Date(), data: data }));

        })
        .catch((error) => {
          res.status(400);
          res.json({
            message: "Id not found",
            createdAt: new Date(),
          });
        });
    } else {
      return res.status(400).json({ message: "Request invalid", createdAt: new Date() });
    }
  };

  //[DELETE] /products/:id
  deleteProduct = (req, res) => {
    console.log(req.params.id);
    if (isValidObjectId(req.params.id)) {
      Product.findByIdAndDelete(req.params.id)
        .then((result) => {
          if (result != null) {
            res.status(200);
            res.json({
              message: "Product deleted",
              createdAt: new Date(),
              dataRemoved: result
            });
          } else {
            return res.status(404).json({ message: "Product not found", createdAt: new Date(), dataRemoved: null })
          }
        })
        .catch((err) => {
          res.status(404);
          res.json({ message: err.message, createdAt: new Date() });
        });
    } else {
      return res.status(400).json({ message: "Request invalid", createdAt: new Date(), dataRemoved: null });
    }

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



  // getSizeList = (req, res) => {
  //   SizeProduct.find().then((data) => {
  //     console.log(data);
  //     let list = [];
  //     const result = data.map((item) => {
  //       list.push({ ...item._doc });
  //     });
  //     res.json({
  //       list: list,
  //       recordSize: list.length,
  //     });
  //   });
  // }
  getSizeList = async (req, res) => {
    const data = await SizeProduct.find()
    return res.json({ list: data, recordSize: data.length })
  }

  createSize = (req, res) => {
    const sizeReq = req.body.size;
    const categoryIdReq = req.body.categoryId
    if (typeof (sizeReq) != 'string') {
      return res.status(400).json({ message: "Size request invalid", createdAt: new Date() })
    }
    SizeProduct.find({ categoryId: categoryIdReq }).then((listSize) => {
      const filterListSize = listSize.filter(item => item.size === sizeReq)
      if (filterListSize.length > 0) {
        return res.status(400).json({ message: "Size is exits", createdAt: new Date() })
      }
      new SizeProduct({ categoryId: categoryIdReq, size: sizeReq }).save().then((data) => {
        return res.status(200).json({ data: data, createdAt: new Date() })
      })
    });
  }

  getSizeByCategoryId = async (req, res, next) => {
    const categoryId = req.params.categoryId
    try {
      const product = await SizeProduct.find({ categoryId: categoryId })
      if (product != null) {
        return res.status(200).json({ data: product, recordSize: product.length })
      } else {
        return res.status(400).json({
          message: 'Size not found',
          createdAt: new Date()
        })
      }
    } catch (error) {
      return res.status(400).json({
        message: error.message,
        createdAt: new Date()
      })
    }



  }

  delelteSizeByCategoryId = (req, res) => {
    if (req.body.categoryId) {
      const categoryId = req.body.categoryId;
      SizeProduct.findOneAndDelete({ categoryId: categoryId }).then(data => {
        if (data != null) {
          return res.status(200).json({ message: "Size removed", createdAt: new Date(), dataRemoved: data })
        }
        else {
          return res.status(200).json({ message: "Id category invalid", createdAt: new Date(), dataRemoved: data })
        }
      })
    }
    else {
      return res.status(400).json({ message: "Request invalid", createdAt: new Date(), dataRemoved: null })

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

}

module.exports = new ProductController();
