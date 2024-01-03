const { param, body, validationResult } = require('express-validator');

const validateCreateAccount = [
  body('email').trim().exists().withMessage("Email not exist").isEmail().withMessage("Email not valid"),
  body('password').trim().exists().withMessage("Password not exist").isLength({ min: 6, max: 20 }).withMessage("Password must be at least 6 characters"),
  body("username").trim().exists().withMessage("Username not exist"),
  body("phone").trim().exists().withMessage("Phone not exist").isMobilePhone().withMessage("Phone not valid"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", code: 400, description: "Invalid input data", errors: errors.array(), createdAt: new Date().toLocaleString(), });
    }
    next();
  }
];

const validateEditAccount = [
  body("user_id").exists().withMessage("Id is require").isMongoId().withMessage("Id is not valid"),
  body("password").optional().isLength({ min: 6, max: 20 }).withMessage("Password must be at least 6 characters"),
  body("phone").optional().isMobilePhone().withMessage("Phone not valid"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", code: 400, description: "Bad Request", errors: errors.array(), createdAt: new Date().toLocaleString(), });
    }
    next();
  }
];
const validateDeleteAccount = [
  param("id").exists().withMessage("Id is require").isMongoId().withMessage("Id is not valid"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", code: 400, description: "Bad Request", errors: errors.array(), createdAt: new Date().toLocaleString(), });
    }
    next();
  }
]

module.exports = {
  validateCreateAccount, validateEditAccount, validateDeleteAccount
};
