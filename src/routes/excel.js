const express = require("express");
const router = express.Router();

const ExcelController = require("../app/controllers/ExcelControllr");
const verifyToken = require("../middleware/auth");


router.get("/products", ExcelController.exportProducts);
router.get("/accounts", ExcelController.exportAccounts);
router.get("/orders", ExcelController.exportOrder);



module.exports = router;
