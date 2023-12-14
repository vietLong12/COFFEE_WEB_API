const express = require("express");
const router = express.Router();

const accountController = require("../app/controllers/AccountController");
const validateEditAccount = require("../util/validator");

router.get("/", accountController.listAccount);

router.post("/", accountController.createAccount);

router.get("/:id", accountController.getAccount);

router.put("/", validateEditAccount, accountController.editAccount);

router.delete("/:id", accountController.deleteAccount);

module.exports = router;
