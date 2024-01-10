const { param, body, validationResult } = require('express-validator');

const validateAddToCart = [
    body('accountId').exists().withMessage("Account id not exist").isMongoId().withMessage("Account id not valid"),
    body('productId').exists().withMessage("Product id not exist").isMongoId().withMessage("Product id not valid"),
    body('sizeId').exists().withMessage("Size id not exist").isMongoId().withMessage("Size id not valid"),
    body('quantity').optional().isNumeric().withMessage("Quantity not valid"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", code: 400, description: "Invalid input data", errors: errors.array(), createdAt: new Date().toLocaleString(), });
        }
        next();
    }
];

const validateOrder = [
    body("customer").isObject().withMessage("Customer data must be an object"),
    body("customer.username").exists().withMessage("Customer name not exist").trim(),
    body("customer.address").exists().withMessage("Customer address not exist").trim(),
    body("customer.email").exists().withMessage("Customer email not exist").isEmail().withMessage("Invalid email format"),
    body("customer.phone").exists().withMessage("Customer phone not exist").isMobilePhone().withMessage("Invalid phone number"),
    body('accountId').exists().withMessage("Account id not exist").isMongoId().withMessage("Account id not valid"),
    body("paymentMethod").exists().withMessage("Payment method not exist").isIn(['cod', 'momo']).withMessage("Payment method not valid"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", code: 400, description: "Invalid input data", errors: errors.array(), createdAt: new Date().toLocaleString(), });
        }
        next();
    }]

const validateUpdateOrder = [
    body('orderId').exists().withMessage("Order id not exist").isMongoId().withMessage("Order id not valid"),
    body('statusOrder').exists().withMessage("Status order id not exist").isIn(['1', '2', '3', "4"]).withMessage("Status order not valid"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", code: 400, description: "Invalid input data", errors: errors.array(), createdAt: new Date().toLocaleString(), });
        }
        next();
    }
]
const validateGetOrderById = [
    param('orderId').exists().withMessage("Order id not exist").isMongoId().withMessage("Order id not valid"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", code: 400, description: "Invalid input data", errors: errors.array(), createdAt: new Date().toLocaleString(), });
        }
        next();
    }
]
module.exports = {
    validateAddToCart, validateOrder, validateUpdateOrder, validateGetOrderById
};
