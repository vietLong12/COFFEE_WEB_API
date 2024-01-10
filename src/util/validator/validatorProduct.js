const { param, body, validationResult } = require('express-validator');

const validateCreateProduct = [
    body('productName').exists().withMessage("Product name not exist").trim(),
    body("categoryId").exists().withMessage("Category id not exist").isMongoId().withMessage("Category Id not valid"),
    body("sizes").exists().withMessage("Sizes not exist").isArray().withMessage("Sizes not valid").notEmpty().withMessage("Sizes not empty"),
    body("sizes.*").isObject().withMessage("Each size must be an object"),
    body("sizes.*.name").exists().withMessage("Size name not exist"),
    body("sizes.*.price").exists().withMessage("Size price not exist").isNumeric().withMessage("Size price not valid"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "error",
                code: 400,
                description: "Invalid input data",
                errors: errors.array(),
                createdAt: new Date().toLocaleString(),
            });
        }
        next();
    }
];

const validateUpdateProduct = [
    body('productId').exists().withMessage("Product id is required").isMongoId().withMessage("Product id not valid").trim(),
    body('productName').optional().trim(),
    body("categoryId").optional().isMongoId().withMessage("Category Id not valid"),
    body("sizes").optional().isArray().withMessage("Sizes not valid").notEmpty().withMessage("Sizes not empty"),
    body("sizes.*").isObject().withMessage("Each size must be an object"),
    body("sizes.*.name").exists().withMessage("Size name not exist"),
    body("sizes.*.price").exists().withMessage("Size price not exist").isNumeric().withMessage("Size price not valid"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", code: 400, description: "Invalid input data", errors: errors.array(), createdAt: new Date().toLocaleString(), });
        }
        next();
    }];

const validateParamDeleteProduct = [
    param('productId').exists().withMessage("Product id is required").isMongoId().withMessage("Product id not valid").trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", code: 400, description: "Invalid input data", errors: errors.array(), createdAt: new Date().toLocaleString(), });
        }
        next();
    }
]


const validateCreateRate = [
    body('comment').exists().withMessage("Comment is required").trim(),
    body('email').exists().withMessage("Email is required").isEmail().withMessage("Email not valid").trim(),
    body("username").exists().withMessage("Username not valid"),
    body("vote").exists().withMessage("Vote number is rerquired").isNumeric().withMessage("Vote number not valid"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", code: 400, description: "Invalid input data", errors: errors.array(), createdAt: new Date().toLocaleString(), });
        }
        next();
    }
]

module.exports = {
    validateCreateProduct, validateUpdateProduct, validateParamDeleteProduct, validateCreateRate
}
