const express = require("express");
const router = express.Router();

const OrderController = require("../app/controllers/OrderController");
const { validateAddToCart, validateOrder, validateUpdateOrder, validateGetOrderById } = require("../util/validator/validatorCart");
const verifyToken = require("../middleware/auth");

//handle cart 
router.post("/cart", validateAddToCart, OrderController.addToCart);


//handle order
router.get("/", verifyToken, OrderController.getListOrder)
router.post("/", validateOrder, OrderController.createOrder)
router.put("/", validateUpdateOrder, OrderController.updateOrder)
router.get("/:orderId", validateGetOrderById, OrderController.getOrderById)
module.exports = router;
