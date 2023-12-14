const { check } = require("express-validator");

const validateEditAccount = [
  (req, res, next) => {
    if (req.body.phone) {
      check("phone").isMobilePhone().withMessage("Phone not valid")(
        req,
        res,
        next
      );
    } else {
      next();
    }
  },
  (req, res, next) => {
    if (req.body.email) {
      check("email").isEmail().withMessage("Email not valid")(req, res, next);
    } else {
      next();
    }
  },
  check("id")
    .exists()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Id not valid"),
];

module.exports = validateEditAccount;
