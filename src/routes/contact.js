const express = require("express");
const router = express.Router();

const contactController = require("../app/controllers/ContactController");
const { validateCreateContact } = require("../util/validator/validatorContact");



router.get("/", contactController.listContact);
router.post("/", validateCreateContact, contactController.createContact);



module.exports = router;
