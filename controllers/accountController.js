const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const e = require("connect-flash");


const accountController = {};

/* ****************************************
 *  Deliver login view
 * **************************************** */
accountController.buildLogin = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const loginForm = utilities.buildLoginForm();
    res.render("account/login", {
      title: "Login",
      nav,
      loginForm,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Deliver registration view
 * **************************************** */
accountController.buildRegister = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const registerForm = utilities.buildRegisterForm();
    res.render("account/register", {
      title: "Register",
      nav,
      registerForm,
      message: req.flash("notice"),
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res) {
  try {


    let nav = await utilities.getNav()
    const reqBody = req.body
    console.log('Registration data CONTROLLER: ', req.body,reqBody)
    const regResult = await accountModel.registerAccountModel(
      reqBody.first_name,
      reqBody.last_name,
      reqBody.email,
      reqBody.password
    )
    console.log('Registration result CONTROLLER: ', regResult)
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${reqBody.first_name}. Please log in.`
      )
      const loginForm = utilities.buildLoginForm();
      res.render("account/login", {
        title: "Login",
        nav,
        loginForm,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      const registerForm = utilities.buildRegisterForm();
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        registerForm,
        errors: null,
        
      })
    }
  } catch (error) {
    console.error('Error processing registration CONTROLLER: ', error.message)
    res.status(500).send("An error occurred during registration. Please try again later.")

  }
}

module.exports = accountController;