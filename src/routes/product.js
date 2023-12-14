const express = require("express");
const router = express.Router();

const productController = require("../app/controllers/ProductController");


router.get("/size/:categoryId", productController.getSizeByCategoryId)
router.delete("/size", productController.delelteSizeByCategoryId);
router.get("/size", productController.getSizeList)
router.post("/size", productController.createSize)

router.post("/category", productController.createCategory)
router.get("/category", productController.getCategoryList)
router.delete("/category", productController.deleteCategoryById)

router.get("/", productController.listProduct);

router.post("/", productController.createProduct);

router.get("/:id", productController.getProductById);

router.put("/", productController.editProduct);

router.delete("/:id", productController.deleteProduct);




module.exports = router;
