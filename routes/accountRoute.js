const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')
const loginValidate = require('../utilities/login-validation')
const updateValidate=require('../utilities/update-validation')

// Route to build login view
router.get("/login", accountController.buildLogin);
//Route to process login form
router.post('/login',loginValidate.loginRules(),loginValidate.checkLoginData ,accountController.accountLogin);
// Route to build registration view
router.get("/register", accountController.buildRegister);
// Route to process register form
router.post('/register', regValidate.registationRules(),regValidate.checkRegData,accountController.registerAccount);
//route to account management view
router.get('/',utilities.checkLogin,accountController.buildAccountManagementViewTest);
//update account info
router.post("/update",updateValidate.updateAccountRules(),updateValidate.checkUpdateAccountData,accountController.updateAccount);
router.post("/update-password", updateValidate.updatePasswordRules(),updateValidate.checkUpdatePasswordData, accountController.updatePassword);
// route account update view
router.get("/update",accountController.updateAccountView);


//logout route
router.get("/logout", accountController.logout);


// Export the router

module.exports = router;