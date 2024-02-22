const express = require("express");
const router = express.Router();

const ExcelController = require("../app/controllers/ExcelControllr")


router.get("/products", ExcelController.exportProducts);
router.get("/accounts", ExcelController.exportAccounts);
router.get("/orders", ExcelController.exportOrder);



module.exports = router;
