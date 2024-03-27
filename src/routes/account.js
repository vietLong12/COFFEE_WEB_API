const express = require("express");
const router = express.Router();

const accountController = require("../app/controllers/AccountController");
const { validateCreateAccount, validateEditAccount, validateDeleteAccount } = require('../util/validator/validatorAccount');
const verifyToken = require("../middleware/auth");


router.get("/:id", accountController.getAccount);

router.get("/", verifyToken, accountController.listAccount);

router.post("/", validateCreateAccount, accountController.createAccount);


router.put("/", validateEditAccount, accountController.editAccount);

router.delete("/:id", verifyToken, validateDeleteAccount, accountController.deleteAccount);

module.exports = router;
