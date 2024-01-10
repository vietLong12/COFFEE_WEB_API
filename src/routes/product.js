const express = require("express");
const router = express.Router();

const productController = require("../app/controllers/ProductController");
const { validateCreateProduct, validateUpdateProduct, validateParamDeleteProduct, validateCreateRate } = require('../util/validator/validatorProduct');



router.post("/category", productController.createCategory)
router.get("/category", productController.getCategoryList)
router.delete("/category", productController.deleteCategoryById)


router.get("/", productController.listProduct);
router.post("/", validateCreateProduct, productController.createProduct);
router.get("/:id", productController.getProductById);
router.put("/", validateUpdateProduct, productController.editProduct);
router.delete("/:productId", validateParamDeleteProduct, productController.deleteProduct);

router.post("/image", productController.handleImage)

router.post("/rate", validateCreateRate, productController.commentProduct)


module.exports = router;
