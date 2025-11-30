const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const e = require("connect-flash");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt");

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
      message: req.flash("notice"),
      errors: null,
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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(reqBody.password, saltRounds);
    const regResult = await accountModel.registerAccountModel(
      reqBody.first_name,
      reqBody.last_name,
      reqBody.email,
      hashedPassword
    )
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
/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const loginBody = req.body
  const gola= req.body;
  console.log('Login attempt with:', gola); // Debugging line
  const accountData = await accountModel.getAccountByEmail(loginBody.email)

 // Debugging line
  if (!accountData) {
    
    const loginForm = utilities.buildLoginForm();
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: loginBody.email,
      loginForm,
      message: req.flash("notice","Please check your credentials and try again."),
    })
    return
  }
  try {
    if (await bcrypt.compare(loginBody.password, accountData.account_password)) {
      console.log('Password match successful'); // Debugging line
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      const accountManagmentView = accountController.buildAccountManagementView();
      return res.render("account/success-login", {
        title: "Account Management",
        nav,
        accountManagmentView,
        message: req.flash("notice"),
        errors: null,
      });
    }
    else {
      console.log('Password mismatch',accountData.account_password,loginBody.password); // Debugging line
      const loginForm = utilities.buildLoginForm();
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        loginForm,
        errors: null,
        account_email: loginBody.email,
        message: req.flash("message notice", "Please check your credentials and try again Rommel .")
      })
    }
  } catch (error) {
    console.error('Error during account login CONTROLLER: ', error.message)
    throw new Error('Access Forbidden')
    
  }
}




accountController.buildAccountManagementViewTest = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const accountManagmentView = accountController.buildAccountManagementView();
    return res.render("account/success-login", {
      title: "Account Management",
      nav,
      accountManagmentView,
      message: req.flash("notice"),
      errors: null,
    });
  } catch (error) {
    console.error('Error building account management view CONTROLLER: ', error.message)
    
  }
  

}
accountController.buildAccountManagementView = function () {
  return `

<p>You're logged in</p>
  `;
}


module.exports = accountController;