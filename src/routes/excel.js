const express = require("express");
const router = express.Router();

const ExcelController = require("../app/controllers/ExcelControllr");
const verifyToken = require("../middleware/auth");


router.get("/products", verifyToken, ExcelController.exportProducts);
router.get("/accounts", verifyToken, ExcelController.exportAccounts);
router.get("/orders", verifyToken, ExcelController.exportOrder);



module.exports = router;
