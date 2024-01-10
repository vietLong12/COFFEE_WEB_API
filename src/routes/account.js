const express = require("express");
const router = express.Router();

const accountController = require("../app/controllers/AccountController");
const { validateCreateAccount, validateEditAccount, validateDeleteAccount } = require('../util/validator/validatorAccount');


router.get("/", accountController.listAccount);

router.post("/", validateCreateAccount, accountController.createAccount);

router.get("/:id", accountController.getAccount);

router.put("/", validateEditAccount, accountController.editAccount);

router.delete("/:id", validateDeleteAccount, accountController.deleteAccount);

module.exports = router;
