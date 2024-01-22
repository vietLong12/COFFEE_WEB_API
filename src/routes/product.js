const express = require("express");
const router = express.Router();
const fileUploader = require("../util/configs")

const productController = require("../app/controllers/ProductController");
const { validateCreateProduct, validateUpdateProduct, validateParamDeleteProduct, validateCreateRate, validateGetRate } = require('../util/validator/validatorProduct');



router.post("/category", productController.createCategory)
router.get("/category", productController.getCategoryList)
router.delete("/category", productController.deleteCategoryById)


router.get("/", productController.listProduct);
router.post("/", validateCreateProduct, productController.createProduct);
router.get("/:id", productController.getProductById);
router.put("/", validateUpdateProduct, productController.editProduct);
router.delete("/:productId", validateParamDeleteProduct, productController.deleteProduct);


router.post("/rate", validateCreateRate, productController.commentProduct)
router.get("/rate/:productId", validateGetRate, productController.getCommentProduct)


module.exports = router;
