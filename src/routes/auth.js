const express = require("express");
const router = express.Router();

const loginController = require("../app/controllers/LoginController");
const { validateLogin, validateLogout, validateFindPassword, validateNewPassword } = require("../util/validator/validatorLogin");



router.post("/login", validateLogin, loginController.login);
router.post("/logout", validateLogout, loginController.logout);

router.post("/find", validateFindPassword, loginController.findPasswordByEmail)
router.post("/password", validateNewPassword, loginController.createNewPassword)


module.exports = router;
