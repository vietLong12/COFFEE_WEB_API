const { param, body, validationResult } = require('express-validator');

const validateLogin = [
    body('email').optional().isEmail().withMessage("Email not valid"),
    body('password').optional().isLength({ min: 6, max: 20 }).withMessage("Password must be at least 6 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", code: 400, description: "Invalid input data", errors: errors.array(), createdAt: new Date().toLocaleString(), });
        }
        next();
    }
];

const validateLogout = [
    body('email').exists().withMessage("Email not exist").isEmail().withMessage("Email not valid"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", code: 400, description: "Invalid input data", errors: errors.array(), createdAt: new Date().toLocaleString(), });
        }
        next();
    }
];

const validateFindPassword = [
    body('email').exists().withMessage("Email not exist").isEmail().withMessage("Email not valid"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", code: 400, description: "Invalid input data", errors: errors.array(), createdAt: new Date().toLocaleString(), });
        }
        next();
    }
]

const validateNewPassword = [
    body('email').exists().withMessage("Email not exist").isEmail().withMessage("Email not valid"),
    body("verifyCode").exists().withMessage("Verify code not exist").notEmpty().withMessage("Verify code not empty").isLength(6).withMessage("Verify code must be at least 6 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", code: 400, description: "Invalid input data", errors: errors.array(), createdAt: new Date().toLocaleString(), });
        }
        next();
    }
]


module.exports = {
    validateLogin, validateLogout, validateFindPassword, validateNewPassword
};
