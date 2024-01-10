const { param, body, validationResult } = require('express-validator');

const validateCreateContact = [
    body('username').exists().withMessage("Username not exist"),
    body('email').exists().withMessage("Email not exist").isEmail().withMessage("Email not valid"),
    body('phone').exists().withMessage("Phone not exist").isMobilePhone().withMessage("Phone not valid"),
    body('content').exists().withMessage("Content not exist"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", code: 400, description: "Invalid input data", errors: errors.array(), createdAt: new Date().toLocaleString(), });
        }
        next();
    }
];

module.exports = {
    validateCreateContact
};
