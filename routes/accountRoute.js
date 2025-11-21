const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", accountController.buildLogin);
// Route to build registration view
router.get("/register", accountController.buildRegister);
// Route to process login form
router.post('/register', regValidate.registationRules(),regValidate.checkRegData,accountController.registerAccount);
// Export the router
module.exports = router;
